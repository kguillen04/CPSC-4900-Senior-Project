const ALPHA = 0.15;

function normalizeScore(score) {
    return Math.max(0, Math.min(1, score));
}

function normalizeConcept(concept) {
    return concept.trim().toLowerCase();
}

export function findMasteryEntry(user, concept) {
    const normalized = normalizeConcept(concept);

    const entry = user.mastery.find(
        (m) => normalizeConcept(m.concept) === normalized
    );

    if (!entry) {
        throw new Error (`Mastery entry not found for concept: ${concept}`);
    }

    return entry;
}

export function getMasteryScore(user, concept) {
    const entry = findMasteryEntry(user, concept);
    return normalizeScore(entry.score);
}

export function setMasteryScore(user, concept, newScore) {
    const entry =  findMasteryEntry(user, concept);
    entry.score = normalizeScore(newScore);
    return entry.score;
}

export function getTargetScore(correct, difficulty) {
    const correctTargets = {
        1: 0.60,
        2: 0.68,
        3: 0.78,
        4: 0.88,
        5: 0.95
    };

    const incorrectTargets = {
        1: 0.40,
        2: 0.32,
        3: 0.24,
        4: 0.16,
        5: 0.10,
    }

    const difficulty = Number(difficulty);

    return correct 
        ? correctTargets[difficulty] :
          incorrectTargets[difficulty];
}

export function updateMastery(oldScore, correct, difficulty, alpha=ALPHA) {
    const normalOld = normalizeScore(oldScore);
    const targetScore = getTargetScore(correct, difficulty);
    return normalizeScore(normalOld + alpha * (targetScore - normalOld))
}

export function updateUserMastery(user, concept, correct, difficulty) {
    const oldScore = getMasteryScore(user, concept);
    const newScore = updatMastery(oldScore, correct, difficulty);

    setMasteryScore(user, concept, newScore);

    return {
        concept: normalizeConcept(concept),
        oldScore,
        newScore,
        delta: newScore - oldScore,
        correct,
        difficulty: Number(difficulty)
    };
}