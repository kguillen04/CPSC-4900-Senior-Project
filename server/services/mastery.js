/**
 * Mastery Service
 * 
 * Contains functions for managing and updating user mastery scores/
 * 
 * This module implements the core adaptive learning logic, including:
 * - Mastery retrieval and updates
 * - Target score computation
 * - Mastery update rule
 * 
 * These functions are used to drive the adaptive feedback loop that adjusts question difficulty
 * based on user performance.
*/
const ALPHA = 0.15;

/**
 * Normalizes a score to the valid mastery range [0, 1].
 * 
 * @param {number} score
 * @returns {number} normalized score
 */
function normalizeScore(score) {
    return Math.max(0, Math.min(1, score));
}

/**
 * Normalizes a concept string to a consistent format.
 * 
 * @param {string} concept 
 * @returns {string} normalized concept
 */
function normalizeConcept(concept) {
    return concept.trim().toLowerCase();
}

/**
 * Finds the mastery entry for a given concept within a user document.
 * 
 * @param {Object} user 
 * @param {string} concept 
 * @returns {Object} mastery entry
 * @throws {Error} if the concept is not found
 */
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

/**
 * Gets the mastery score for a specific concept for a user.
 * 
 * @param {Object} user 
 * @param {string} concept 
 * @returns {number} mastery score
 */
export function getMasteryScore(user, concept) {
    const entry = findMasteryEntry(user, concept);
    return normalizeScore(entry.score);
}

/**
 * Sets the mastery score for a specific concept for a user.
 * 
 * @param {Object} user 
 * @param {string} concept 
 * @param {number} newScore 
 * @returns {number} updated mastery score
 */
export function setMasteryScore(user, concept, newScore) {
    const entry =  findMasteryEntry(user, concept);
    entry.score = normalizeScore(newScore);
    return entry.score;
}

/**
 * Gets the target mastery score for a question based on whether the user's answer was correct and the question difficulty.
 * 
 * @param {string} correct 
 * @param {number} difficulty 
 * @returns {number} target mastery score 
 */
export function getTargetScore(correct, difficulty) {
    const correctTargets = {
        1: 0.60,
        2: 0.68,
        3: 0.78,
        4: 0.88,
        5: 0.95
    };

    const incorrectTargets = {
        1: 0.10,
        2: 0.16,
        3: 0.24,
        4: 0.32,
        5: 0.40,
    }

    const numDifficulty = Number(difficulty);

    return correct 
        ? correctTargets[numDifficulty] :
          incorrectTargets[numDifficulty];
}

/**
 * Updates the mastery score based on the user's performance on a question.
 * 
 * @param {number} oldScore 
 * @param {boolean} correct 
 * @param {number} difficulty 
 * @param {number} alpha 
 * @returns {number} updated mastery score
 */
export function updateMastery(oldScore, correct, difficulty, alpha=ALPHA) {
    const normalOld = normalizeScore(oldScore);
    const targetScore = getTargetScore(correct, difficulty);
    return normalizeScore(normalOld + alpha * (targetScore - normalOld))
}

/**
 * Updates a user's mastery score for a given concept based on their performance on a question.
 * 
 * @param {Object} user 
 * @param {string} concept 
 * @param {boolean} correct 
 * @param {number} difficulty 
 * @returns {Object} update detals including old score, new score, and delta
 */
export function updateUserMastery(user, concept, correct, difficulty) {
    const oldScore = getMasteryScore(user, concept);
    const newScore = updateMastery(oldScore, correct, difficulty);

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