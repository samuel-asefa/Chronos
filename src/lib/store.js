import { writable } from 'svelte/store';
import { ALL_QUESTIONS } from './questions.js';

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

export const currentScreen = writable('start'); // 'start', 'game', 'results'
export const selectedCategory = writable('all');

// Game State
export const score = writable(0);
export const lives = writable(3);
export const streak = writable(0);
export const bestStreak = writable(0);
export const currentQuestions = writable([]);
export const currentQuestionIdx = writable(0);
export const gameResults = writable([]);

export function startGame(category) {
    selectedCategory.set(category);
    const pool = category === 'all' ? ALL_QUESTIONS : ALL_QUESTIONS.filter(q => q.cat === category);

    // Pick 10 random questions
    currentQuestions.set(shuffle(pool).slice(0, 10));

    // Reset stats
    score.set(0);
    lives.set(3);
    streak.set(0);
    bestStreak.set(0);
    currentQuestionIdx.set(0);
    gameResults.set([]);

    currentScreen.set('game');
}

export function advanceQuestion() {
    currentQuestionIdx.update(idx => idx + 1);
}

export function recordResult(result) {
    gameResults.update(r => [...r, result]);
}

export function endGame() {
    currentScreen.set('results');
}

// Derived states could be beneficial here but for now direct updates is fine.
