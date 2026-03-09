<script>
    import {
        score,
        gameResults,
        bestStreak,
        currentScreen,
    } from "../lib/store.js";
    import { RotateCcw, LayoutGrid } from "lucide-svelte";

    $: correctCount = $gameResults.filter((r) => r.isCorrect).length;
    $: totalCount = $gameResults.length || 1; // prevent div by zero
    $: pct = correctCount / totalCount;

    $: grade =
        pct >= 0.9
            ? "S"
            : pct >= 0.8
              ? "A"
              : pct >= 0.6
                ? "B"
                : pct >= 0.4
                  ? "C"
                  : "F";
    $: label =
        pct >= 0.9
            ? "Legendary"
            : pct >= 0.8
              ? "Excellent"
              : pct >= 0.6
                ? "Great Work"
                : pct >= 0.4
                  ? "Good Effort"
                  : "Needs Practice";

    function playAgain() {
        // Relying on App.svelte to orchestrate or directly start with same cat.
        // We'll just change the screen to start to let user pick again or use current cat.
        $currentScreen = "start"; // Actually resetting state should be done in startGame
    }

    function getScoreColor(g) {
        if (g === "S" || g === "A") return "var(--accent)";
        if (g === "B" || g === "C") return "var(--warning)";
        return "var(--danger)";
    }
</script>

<div class="screen">
    <div class="grade-circle" style="--grade-color: {getScoreColor(grade)}">
        <div class="grade-text">{grade}</div>
        <svg class="grade-ring" width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="76" class="ring-bg" />
            <circle
                cx="80"
                cy="80"
                r="76"
                class="ring-fill"
                stroke-dasharray="477.5"
                stroke-dashoffset={477.5 * (1 - pct)}
            />
        </svg>
    </div>

    <h2 class="result-label" style="color: {getScoreColor(grade)}">{label}</h2>

    <div class="stats-grid">
        <div class="stat-card glass-panel">
            <div class="stat-val">{$score}</div>
            <div class="stat-lbl">Final Score</div>
        </div>
        <div class="stat-card glass-panel">
            <div class="stat-val">{correctCount}/{totalCount}</div>
            <div class="stat-lbl">Correct</div>
        </div>
        <div class="stat-card glass-panel">
            <div class="stat-val">{$bestStreak}</div>
            <div class="stat-lbl">Best Streak</div>
        </div>
    </div>

    <div class="review-section">
        <h3 class="review-title">Mission Review</h3>
        <div class="review-list">
            {#each $gameResults as r}
                <div class="review-item glass-panel">
                    <div
                        class="review-dot {r.isCorrect
                            ? 'c'
                            : r.partial
                              ? 'p'
                              : 'w'}"
                    ></div>
                    <div class="review-text">
                        <div class="r-q">{r.q.text}</div>
                        <div class="r-ans">
                            The answer is {r.q.type === "mc"
                                ? r.q.opts[r.q.answer]
                                : r.q.answer}
                        </div>
                    </div>
                    <div class="review-pts {r.pts > 0 ? 'positive' : ''}">
                        +{r.pts}
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <div class="actions">
        <button class="btn-primary" on:click={playAgain}>
            <LayoutGrid size={18} />
            Menu
        </button>
    </div>
</div>

<style>
    .screen {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        animation: fadeIn 0.6s ease-out forwards;
    }

    .grade-circle {
        position: relative;
        width: 160px;
        height: 160px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
        animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .grade-text {
        font-family: var(--font-heading);
        font-size: 72px;
        font-weight: 700;
        color: var(--grade-color);
        text-shadow: 0 0 24px rgba(0, 0, 0, 0.5);
    }

    .grade-ring {
        position: absolute;
        inset: 0;
        transform: rotate(-90deg);
    }

    .ring-bg {
        fill: none;
        stroke: var(--surface-border);
        stroke-width: 6;
    }

    .ring-fill {
        fill: none;
        stroke: var(--grade-color);
        stroke-width: 6;
        stroke-linecap: round;
        transition: stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1);
        filter: drop-shadow(0 0 8px var(--grade-color));
    }

    .result-label {
        font-family: var(--font-mono);
        font-size: 16px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        margin-bottom: 40px;
        animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        width: 100%;
        margin-bottom: 48px;
        animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .stat-card {
        padding: 24px 16px;
        text-align: center;
    }

    .stat-val {
        font-family: var(--font-heading);
        font-size: 32px;
        font-weight: 700;
        color: var(--text-primary);
        line-height: 1;
        margin-bottom: 8px;
    }

    .stat-lbl {
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--text-muted);
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }

    .review-section {
        width: 100%;
        margin-bottom: 40px;
        animation: slideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .review-title {
        font-family: var(--font-mono);
        font-size: 12px;
        color: var(--text-muted);
        letter-spacing: 0.1em;
        text-transform: uppercase;
        margin-bottom: 16px;
    }

    .review-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .review-item {
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .review-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        flex-shrink: 0;
    }

    .review-dot.c {
        background: var(--success);
        box-shadow: 0 0 8px var(--success);
    }
    .review-dot.w {
        background: var(--danger);
        box-shadow: 0 0 8px var(--danger);
    }
    .review-dot.p {
        background: var(--warning);
        box-shadow: 0 0 8px var(--warning);
    }

    .review-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .r-q {
        font-size: 14px;
        color: var(--text-primary);
        font-weight: 500;
    }

    .r-ans {
        font-size: 13px;
        color: var(--accent);
        opacity: 0.9;
    }

    .review-pts {
        font-family: var(--font-mono);
        font-size: 14px;
        font-weight: 600;
        color: var(--text-muted);
    }

    .review-pts.positive {
        color: var(--success);
    }

    .actions {
        display: flex;
        gap: 16px;
        animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .btn-primary {
        background: var(--text-primary);
        color: var(--bg-dark);
        padding: 16px 40px;
        font-size: 14px;
        font-weight: 600;
        border-radius: var(--radius-full);
        display: flex;
        align-items: center;
        gap: 10px;
        transition: all 0.25s;
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(248, 250, 252, 0.25);
        background: #fff;
    }

    @media (max-width: 640px) {
        .stats-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
