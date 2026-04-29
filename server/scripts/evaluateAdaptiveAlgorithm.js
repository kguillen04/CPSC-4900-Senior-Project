import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";

import User from "../models/User.js";
import Attempt from "../models/Attempt.js";
import Question from "../models/Question.js";
import { nextQuestion } from "../services/question.js";
import { updateUserMastery, getMasteryScore } from "../services/mastery.js";

dotenv.config();

/**
 * Evaluation Script
 * 
 * Runs controlled simulations to evaluate the ffectiveness of the adaptive learning algorithm
 * compared to a random difficulty baselines. 
 * 
 * This script:
 * - Simulates multiple learner profiles (Struggling, Improving, Strong)
 * - Runs multiple trials per profile and policy
 * - Executes full learning sessions across multiple concepts
 * - Logs attempt-level and session-level data
 * - Outputs results as CSV and JSON files for analysis
 * 
 * Key variables:
 * - NUM_TRIALS: number of independent runs per condition
 * - QUESTIONS_PER_SESSION: number of attempts per session
 * - POLICIES: adaptive vs random difficulty selection
 * 
 * This file is central to the experimental evaluation described in the paper.
 */

/**
 * Experiment Configuration
 * 
 * Defines the parameters used for evaluation:
 * - Concepts tested
 * - Policies compared
 * - Number of trials
 * - Session length
 */
const DB_NAME = "adaptive-learning";
const CONCEPTS = ["variables", "conditionals", "loops"];
const POLICIES = ["adaptive", "random"];
const NUM_TRIALS = 30;
const QUESTIONS_PER_SESSION = 100;

const OUTPUT_DIR = path.resolve("evaluation-output");
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, "-");

const ATTEMPT_CSV_PATH = path.join(OUTPUT_DIR, `adaptive-eval-attempts-${TIMESTAMP}.csv`);
const SESSION_CSV_PATH = path.join(OUTPUT_DIR, `adaptive-eval-sessions-${TIMESTAMP}.csv`);
const JSON_PATH = path.join(OUTPUT_DIR, `adaptive-eval-full-${TIMESTAMP}.json`);

const CLEAN_UP = true;

/**
 * Simulated Learner Profiles
 * 
 * Each profile defines a probability of answering correctly based on:
 * - Question difficulty
 * - Attempt number
 * 
 * Profiles:
 * - Struggling: low accuracy, especially at higher difficulty levels
 * - Improving: accuracy increases over time
 * - Strong: consistently high accuracy
 */
const LEARNER_PROFILES = [
    {
        name: "Struggling",
        probabilityByDifficulty(attemptNumber, difficulty) {
            const probs = {
                1: 0.55,
                2: 0.40,
                3: 0.25,
                4: 0.15,
                5: 0.05,
            };
            return probs[difficulty] ?? 0.25;
        },
    },
    {
        name: "Improving",
        probabilityByDifficulty(attemptNumber, difficulty) {
            const base = {
                1: 0.60,
                2: 0.45,
                3: 0.30,
                4: 0.20,
                5: 0.10,
            };
            
            const growthperAttempt = 0.03;
            const cap = 0.20;

            const bonus = Math.min(cap, (attemptNumber - 1) * growthperAttempt);
            return normalizeProbability((base[difficulty] ?? 0.30) + bonus);
        },
    },
    {
        name: "Strong",
        probabilityByDifficulty(attemptNumber, difficulty) {
            const probs = {
                1: 0.95,
                2: 0.90,
                3: 0.80,
                4: 0.70,
                5: 0.65,
            };
            return probs[difficulty] ?? 0.75;
        },
    },
];

/**
 * Helper Functions
 * 
 * - normalizeProbability: ensures probabilities are between 0 and 1
 * - wrongIndex: selects a random incorrect choice index
 * - csvEscape: escapes values for CSV formatting
 * - toCsv: converts an array of objects to CSV string
 * - ensureOutputDir: creates the output directory if it doesn't exist
 * - createTestUser: creates a temporary user for evaluation
 * - cleanupTestUser: deletes the test user and their attempts
 * - resetConceptState: clears attempts for a specific concept to reset mastery
 * - reloadUser: fetches the latest user data from the database
 * - getQuestion: retrieves full question details if only an ID is provided
 */
function normalizeProbability(value) {
    return Math.max(0, Math.min(1, value));
}

function wrongIndex(correctIndex, choiceCount) {
    const wrongIndices = [];
    for (let i = 0; i < choiceCount; i++) {
        if (i !== correctIndex) {
            wrongIndices.push(i);
        }
    }
    return wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
}

function csvEscape(value) {
    const str = String(value ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function toCsv(rows) {
    if (!rows.length) return "";
    
    const headers = Object.keys(rows[0]);
    const lines = [headers.join(",")];
    for (const row of rows) {
        const line = headers.map(h => csvEscape(row[h])).join(",");
        lines.push(line);
    }
    return lines.join("\n");
}

async function ensureOutputDir() {
    await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
}

async function createTestUser(profileName) {
    const email = `eval_${profileName}_${Date.now()}@example.com`;

    return User.create({
        firstName: "Eval",
        lastName: profileName,
        email,
        passwordHash: "evaluation-only",
        bio: `Temporary evalution user for profile: ${profileName}`,
    });
}

async function cleanupTestUser(userId) {
    await Attempt.deleteMany({ userId });
    await User.findByIdAndDelete(userId);
}

async function resetConceptState(userId, concept) {
    await Attempt.deleteMany({ userId, concept });
}

async function reloadUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error(`User not found: ${userId}`);
    }
    return user;
}

async function getQuestion(questionLike) {
    if (questionLike.correctIndex !== undefined) {
        return questionLike;
    }

    const fullQuestion = await Question.findById(questionLike._id);
    if (!fullQuestion) {
        throw new Error(`Question not found: ${questionLike._id}`);
    }
    return fullQuestion;
}

/**
 * Runs a single evaluation session for a given user, learner profile, concept, and policy (adaptive or random)
 * 
 * For each attempt in the session:
 * 1. Selects a question using the specified policy
 * 2. Simulates correctness based on the learner profile
 * 3. Records attempt data
 * 4. Updates user mastery
 * 
 * Returns:
 * - attemptRows: detailed data for each attempt in the session
 * - sessionSummary: aggregated data summarizing the session's outcomes
 */
async function runSession(user, profile, concept, policy, trial) {
    await resetConceptState(user._id, concept);
    user = await reloadUser(user._id);

    const attemptRows = [];
    const startingMastery = getMasteryScore(user, concept);
    let numCorrect = 0;

    for (let attemptNumber = 1; attemptNumber <= QUESTIONS_PER_SESSION; attemptNumber++) {
        const oldMastery = getMasteryScore(user, concept);

        const selection = await nextQuestion(user._id, concept, oldMastery, policy);
        const fullQuestion = await getQuestion(selection.question);

        const difficulty = Number(fullQuestion.difficulty);
        const probabilityCorrect = profile.probabilityByDifficulty(attemptNumber, difficulty);
        const correct = Math.random() < probabilityCorrect;

        const selectedIndex = correct
            ? fullQuestion.correctIndex
            : wrongIndex(fullQuestion.correctIndex, fullQuestion.choices.length);

        if (correct) numCorrect++;

        await Attempt.create({
            userId: user._id,
            questionId: fullQuestion._id,
            concept,
            difficulty,
            selectedIndex,
            correct,
            responseTimeMs: 1000 + Math.floor(Math.random() * 4000),
        });

        const masteryUpdate = updateUserMastery(user, concept, correct, difficulty);
        await user.save();

        attemptRows.push({
            trial,
            profile: profile.name,
            policy,
            concept,
            attempt: attemptNumber,
            sessionLength: QUESTIONS_PER_SESSION,
            questionId: String(fullQuestion._id),
            difficulty,
            targetDifficulty: selection.targetDifficulty,
            selectionMode: selection.selectionMode,
            probabilityCorrect: probabilityCorrect.toFixed(3),
            correct,
            selectedIndex,
            correctIndex: fullQuestion.correctIndex,
            oldMastery: oldMastery.toFixed(3),
            newMastery: masteryUpdate.newScore.toFixed(3),
            delta: masteryUpdate.delta.toFixed(3),
        });
    }

    const endingMastery = getMasteryScore(user, concept);

    const sessionSummary = {
        trial,
        profile: profile.name,
        policy,
        concept,
        questionsAnswered: QUESTIONS_PER_SESSION,
        numCorrect,
        accuracy: (numCorrect / QUESTIONS_PER_SESSION).toFixed(3),
        startingMastery: startingMastery.toFixed(3),
        endingMastery: endingMastery.toFixed(3),
        masteryGain: (endingMastery - startingMastery).toFixed(3),
        avgDifficulty: (
            attemptRows.reduce((sum, row) => sum + Number(row.difficulty), 0) / attemptRows.length
        ).toFixed(3),
    };

    return { attemptRows, sessionSummary };
}

/**
 * Main Evaluation Pipeline
 * 
 * Iterates over:
 * - Learner profiles
 * - Policies
 * - Trials
 * - Concepts
 * 
 * For each combination:
 * - Creates a test user
 * - Runs a complete session
 * - Collects results
 * 
 * Outputs:
 * - CSV files for attempts and session summaries
 * - JSON file for full experiment data
 */
async function main() {
    const uri = process.env.ATLAS_URI;
    if (!uri) {
        console.error("ATLAS_URI not set in environment");
        process.exit(1);
    }

    await ensureOutputDir();
    await mongoose.connect(uri, { dbName: DB_NAME });
    console.log(`Connected to MongoDB (${DB_NAME})`);

    const allAttemptRows = [];
    const allSessionRows = [];
    const createdUserIds = [];

    try {
        for (const profile of LEARNER_PROFILES) {
            for (const policy of POLICIES) {
                console.log(`Running profile: ${profile.name} | policy: ${policy}`);

                for (let trial = 1; trial <= NUM_TRIALS; trial++) {
                    const user = await createTestUser(`${profile.name}_${policy}_trial${trial}`);
                    createdUserIds.push(user._id);

                    for (const concept of CONCEPTS) {
                        console.log(`  Trial ${trial} | Concept: ${concept}`);

                        const { attemptRows, sessionSummary } = await runSession(
                            user,
                            profile,
                            concept,
                            policy,
                            trial
                        );

                        allAttemptRows.push(...attemptRows);
                        allSessionRows.push(sessionSummary);
                    }
                }
            }
        }

        await fs.promises.writeFile(ATTEMPT_CSV_PATH, toCsv(allAttemptRows), "utf8");
        await fs.promises.writeFile(SESSION_CSV_PATH, toCsv(allSessionRows), "utf8");
        await fs.promises.writeFile(
            JSON_PATH,
            JSON.stringify(
                {
                    questionsPerSession: QUESTIONS_PER_SESSION,
                    numTrials: NUM_TRIALS,
                    policies: POLICIES,
                    attemptRows: allAttemptRows,
                    sessionRows: allSessionRows,
                },
                null,
                2
            ),
            "utf8"
        );

        console.log("\nEvaluation complete.");
        console.log(`Attempt CSV: ${ATTEMPT_CSV_PATH}`);
        console.log(`Session CSV: ${SESSION_CSV_PATH}`);
        console.log(`JSON: ${JSON_PATH}`);

        console.log("\nSession Summary:");
        for (const row of allSessionRows) {
            console.log(
                `${row.profile} | ${row.policy} | ${row.concept} | start=${row.startingMastery} | end=${row.endingMastery} | gain=${row.masteryGain} | accuracy=${row.accuracy} | avgDifficulty=${row.avgDifficulty}`
            );
        }
    } finally {
        if (CLEAN_UP) {
            for (const userId of createdUserIds) {
                await cleanupTestUser(userId);
            }
            console.log("Cleaned up test users and attempts");
        }

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

main().catch((err) => {
    console.error("Error during evaluation:", err);
    process.exit(1);
});

