import puzzlesData from '../assets/cryptic_riddles_100.json';

/**
 * Utility for shuffling arrays (Fisher-Yates)
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Get all available puzzles
 */
export function getAllPuzzles() {
  return puzzlesData;
}

/**
 * Get puzzle by ID
 */
export function getPuzzleById(id) {
  return puzzlesData.find((p) => p.id === id);
}

/**
 * Generate virtual keyboard letters for a given answer:
 * Includes all unique letters/numbers in the answer + extra random filler characters to make 18 total keys.
 */
export function getKeyboardLettersForAnswer(answer, totalKeys = 18) {
  const cleanAnswer = String(answer).toUpperCase().replace(/[^A-Z0-9]/g, '');
  const answerLetters = Array.from(new Set(cleanAnswer.split('')));
  
  const hasNumbers = /[0-9]/.test(cleanAnswer);
  const poolChars = (hasNumbers
    ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ').split('');
  
  const fillerPool = poolChars.filter((char) => !answerLetters.includes(char));
  
  const neededFillers = Math.max(0, totalKeys - answerLetters.length);
  const selectedFillers = shuffleArray(fillerPool).slice(0, neededFillers);
  
  return shuffleArray([...answerLetters, ...selectedFillers]);
}
