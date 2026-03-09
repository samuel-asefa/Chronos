<script>
    import { startGame, selectedCategory } from "../lib/store.js";
    import {
        Compass,
        BookOpen,
        Cpu,
        Music,
        Rocket,
        PlayCircle,
    } from "lucide-svelte";

    const categories = [
        { id: "all", label: "All Topics", icon: Compass },
        { id: "science", label: "Science", icon: BookOpen },
        { id: "history", label: "History", icon: Compass },
        { id: "tech", label: "Technology", icon: Cpu },
        { id: "culture", label: "Culture", icon: Music },
        { id: "space", label: "Space", icon: Rocket },
    ];

    let localCat = "all";

    function onStart() {
        startGame(localCat);
    }
</script>

<div class="screen">
    <div class="hero">
        <h1 class="hero-title">
            Test your <br /> <em class="glow-text">place in time.</em>
        </h1>
        <p class="hero-sub">
            Guess years, sequence events, and place moments on the timeline.
            History meets trivia — no dates to memorize, just your intuition.
        </p>
    </div>

    <div class="rules-grid">
        <div class="rule-card glass-panel">
            <div class="rule-num">01 — Multiple Choice</div>
            <div class="rule-text">
                4 possible answers. Pick the right year or event. Fast answers
                earn bonus points.
            </div>
        </div>
        <div class="rule-card glass-panel">
            <div class="rule-num">02 — Year Slider</div>
            <div class="rule-text">
                Drag the slider to the year you think an event occurred. Points
                scale with accuracy.
            </div>
        </div>
        <div class="rule-card glass-panel">
            <div class="rule-num">03 — Streak Bonus</div>
            <div class="rule-text">
                Consecutive correct answers multiply your score. A streak of 3 =
                double points.
            </div>
        </div>
        <div class="rule-card glass-panel">
            <div class="rule-num">04 — Three Lives</div>
            <div class="rule-text">
                You have 3 chances. Wrong answers and timeouts cost a life. Lose
                all three and it's over.
            </div>
        </div>
    </div>

    <div class="config-section">
        <h3 class="section-title">Select Focus Area</h3>
        <div class="categories">
            {#each categories as cat}
                <button
                    class="cat-pill {localCat === cat.id ? 'selected' : ''}"
                    on:click={() => (localCat = cat.id)}
                >
                    <svelte:component this={cat.icon} size={14} />
                    {cat.label}
                </button>
            {/each}
        </div>

        <button class="btn-primary start-btn" on:click={onStart}>
            <PlayCircle size={18} />
            <span>Begin Challenge</span>
        </button>
    </div>
</div>

<style>
    .screen {
        animation: fadeIn 0.8s ease-out;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .hero {
        text-align: center;
        margin-bottom: 48px;
        animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .hero-title {
        font-size: clamp(40px, 8vw, 64px);
        letter-spacing: -0.02em;
        margin-bottom: 16px;
    }

    .hero-title em {
        font-style: italic;
        color: var(--accent);
    }

    .glow-text {
        position: relative;
        display: inline-block;
    }

    .glow-text::after {
        content: "place in time.";
        position: absolute;
        left: 0;
        top: 0;
        color: transparent;
        text-shadow: 0 0 24px rgba(59, 130, 246, 0.5);
        z-index: -1;
    }

    .hero-sub {
        font-size: 16px;
        color: var(--text-secondary);
        max-width: 480px;
        margin: 0 auto;
        line-height: 1.6;
    }

    .rules-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 48px;
        width: 100%;
        animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
    }

    .rule-card {
        padding: 20px 24px;
        transition:
            transform 0.2s,
            background 0.2s;
    }

    .rule-card:hover {
        transform: translateY(-2px);
        background: var(--surface-hover);
    }

    .rule-num {
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--accent);
        letter-spacing: 0.1em;
        text-transform: uppercase;
        margin-bottom: 8px;
    }

    .rule-text {
        font-size: 14px;
        color: var(--text-secondary);
        line-height: 1.5;
    }

    .config-section {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        animation: slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
    }

    .section-title {
        font-family: var(--font-mono);
        font-size: 12px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--text-muted);
        margin-bottom: 16px;
    }

    .categories {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
        margin-bottom: 40px;
        max-width: 600px;
    }

    .cat-pill {
        background: var(--surface);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-full);
        padding: 10px 20px;
        font-size: 13px;
        font-weight: 500;
        color: var(--text-secondary);
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .cat-pill:hover {
        background: var(--surface-hover);
        border-color: var(--surface-border-hover);
        color: var(--text-primary);
        transform: translateY(-1px);
    }

    .cat-pill.selected {
        background: var(--accent);
        border-color: var(--accent);
        color: #fff;
        box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
    }

    .start-btn {
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
        box-shadow: 0 8px 32px rgba(248, 250, 252, 0.15);
    }

    .start-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(248, 250, 252, 0.25);
        background: #fff;
    }

    .start-btn:active {
        transform: translateY(0);
    }

    @media (max-width: 640px) {
        .rules-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
