import Question from "../models/Question.js";
import Attempt from "../models/Attempt.js";

function normalizeDifficulty(difficulty) {
    return Math.max(1, Math.min(5, difficulty));
}

export function chooseDifficulty(mastery) {
    if (mastery < 0.20) return 1;
    if (mastery < 0.40) return 2;
    if (mastery < 0.60) return 3;
    if (mastery < 0.80) return 4;
    return 5;
}

export function chooseVariedDifficulty(mastery) {
    const base = chooseDifficulty(mastery);
    const roll = Math.random();

    if (roll < 0.7) return base;
    if (roll < 0.85) return normalizeDifficulty(base - 1);
    return normalizeDifficulty(base + 1);
}

export async function recentQuestionIds(userId, concept, limit=5) {
    const recentAttempts = await Attempt.find({ userId, concept }).sort({ createdAt: -1 }).limit(limit).select("questionId");
    return recentAttempts.map((a) => a.questionId);
}

async function attemptedQuestionIds(userId, concept) {
    const attempts = await Attempt.find({ userId, concept }).select("questionId");
    return attempts.map((a) => a.questionId);
}

async function sample(match) {
    const results = await Question.aggregate([
        { $match: match },
        { $sample: { size: 1 } }
    ]);
    return results[0] || null;
}

export function chooseRandomDifficulty() {
    return Math.floor(Math.random() * 5) + 1;
}

export function chooseTargetDifficulty(mastery, policy = "adaptive") {
    if (policy === "adaptive") {
        return chooseVariedDifficulty(mastery);
    }

    if (policy === "random") {
        return chooseRandomDifficulty();
    }

    throw new Error(`Unknown policy: ${policy}`);
}

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