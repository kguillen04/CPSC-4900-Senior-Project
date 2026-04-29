import Question from "../models/Question.js";
import Attempt from "../models/Attempt.js";

/**
 * Question Service
 * 
 * Contains functions for selecting the next question for a user based on their mastery level and performance history.
 * 
 * This module implements the core adaptive learning logic, including:
 * - Question selection based on mastery and recent attempts
 * - Difficulty targeting and variation
 * 
 * Thes functions are used to drive the adaptive feedback loop that adjusts question difficulty based on user performance.
*/

/**
 * Normalizes a difficulty level to the valid range [1,5].
 * 
 * @param {number} difficulty 
 * @returns {number} normalized difficulty in range [1, 5]
 */
function normalizeDifficulty(difficulty) {
    return Math.max(1, Math.min(5, difficulty));
}

/**
 * Chooses a difficulty level based on the user's mastery score using defined thresholds.
 * 
 * @param {number} mastery 
 * @returns {number} target difficulty level based on mastery thresholds
 */
export function chooseDifficulty(mastery) {
    if (mastery < 0.20) return 1;
    if (mastery < 0.40) return 2;
    if (mastery < 0.60) return 3;
    if (mastery < 0.80) return 4;
    return 5;
}

/**
 * Chooses a difficulty level with some variation around the target difficulty based on mastery, introducing randomness to prevent predictability.
 * 
 * @param {number} mastery 
 * @returns {number} target difficulty with some variation
 */
export function chooseVariedDifficulty(mastery) {
    const base = chooseDifficulty(mastery);
    const roll = Math.random();

    if (roll < 0.7) return base;
    if (roll < 0.85) return normalizeDifficulty(base - 1);
    return normalizeDifficulty(base + 1);
}

/**
 * Retrieves the IDs of recently attempted questions for a user in a specific concept.
 * 
 * @param {string} userId 
 * @param {string} concept 
 * @param {number} limit 
 * @returns {Promise<Array<string>>} array or recent question IDs
 */
export async function recentQuestionIds(userId, concept, limit=5) {
    const recentAttempts = await Attempt.find({ userId, concept }).sort({ createdAt: -1 }).limit(limit).select("questionId");
    return recentAttempts.map((a) => a.questionId);
}

/**
 * Retrieves the IDs of questions that a user has attempted for a specific concept, regardless of recency.
 * 
 * @param {string} userId 
 * @param {string} concept 
 * @returns {Promise<Array<string>>} array of question IDs the user has attempted for the given concept
 */
async function attemptedQuestionIds(userId, concept) {
    const attempts = await Attempt.find({ userId, concept }).select("questionId");
    return attempts.map((a) => a.questionId);
}

/**
 * Samples a question based on the provided match criteria.
 * 
 * @param {Object} match 
 * @returns {Promise<Object|null>} the sampled question or null if none found
 */
async function sample(match) {
    const results = await Question.aggregate([
        { $match: match },
        { $sample: { size: 1 } }
    ]);
    return results[0] || null;
}

/**
 * Chooses a random difficulty level between 1 and 5.
 * 
 * @returns {number} random difficulty level between 1 and 5
 */
export function chooseRandomDifficulty() {
    return Math.floor(Math.random() * 5) + 1;
}

/**
 * Chooses the target difficulty for the next question based on the policy.
 * 
 * @param {number} mastery
 * @param {string} policy
 * @return {number} target difficulty level for the next question
 * @throws {Error} if the policy is unknown
 */
export function chooseTargetDifficulty(mastery, policy = "adaptive") {
    if (policy === "adaptive") {
        return chooseVariedDifficulty(mastery);
    }

    if (policy === "random") {
        return chooseRandomDifficulty();
    }

    throw new Error(`Unknown policy: ${policy}`);
}

/**
 * Retrieves the next question for a user based on their mastery level, recent attempts, and the specified policy.
 * 
 * @param {string} userId 
 * @param {string} concept 
 * @param {number} mastery 
 * @param {string} policy 
 * @returns {Object} the next question and related information
 * @throws {Error} if no questions are found for the concept
 */
export async function nextQuestion(userId, concept, mastery, policy = "adaptive") {
    const targetDifficulty = chooseTargetDifficulty(mastery, policy);
    const recentIds = await recentQuestionIds(userId,concept, 5);
    const attemptedIds = await attemptedQuestionIds(userId, concept);

    let question = await sample({
        concept,
        difficulty: targetDifficulty,
        _id: {
        $nin: [...recentIds, ...attemptedIds],
        },
    });

    if (question) {
        return {
        question,
        targetDifficulty,
        policy,
        strategy: "exact-unseen",
        };
    }

    // 2. exact difficulty, not recent
    question = await sample({
        concept,
        difficulty: targetDifficulty,
        _id: { $nin: recentIds },
    });

    if (question) {
        return {
        question,
        targetDifficulty,
        policy,
        strategy: "exact-not-recent",
        };
    }

    // 3. neighboring difficulty, unseen, not recent
    for (const diff of [
        normalizeDifficulty(targetDifficulty - 1),
        normalizeDifficulty(targetDifficulty + 1),
    ]) {
        question = await sample({
        concept,
        difficulty: diff,
        _id: {
            $nin: [...recentIds, ...attemptedIds],
        },
        });

        if (question) {
        return {
            question,
            targetDifficulty: diff,
            policy,
            strategy: "adjacent-unseen",
        };
        }
    }

    // 4. any difficulty in concept, unseen, not recent
    question = await sample({
        concept,
        _id: {
        $nin: [...recentIds, ...attemptedIds],
        },
    });

    if (question) {
        return {
        question,
        targetDifficulty: question.difficulty,
        policy,
        strategy: "concept-unseen",
        };
    }

    // 5. any difficulty in concept, not recent
    question = await sample({
        concept,
        _id: { $nin: recentIds },
    });

    if (question) {
        return {
        question,
        targetDifficulty: question.difficulty,
        policy,
        strategy: "concept-not-recent",
        };
    }

    // 6. anything in concept
    question = await sample({ concept });

    if (!question) {
        throw new Error(`No questions found for concept: ${concept}`);
    }

    return {
        question,
        targetDifficulty: question.difficulty,
        policy,
        strategy: "concept-any",
    };
}