<script>
    import { score, streak, currentScreen } from "../lib/store.js";
    import { Trophy, Flame } from "lucide-svelte";
</script>

<header class="header">
    <div class="brand">
        <div class="logo">CHRON<span>O</span>S</div>
        <div class="tagline">Timeline Challenge</div>
    </div>

    {#if $currentScreen !== "start" && $currentScreen !== "results"}
        <div class="score-bar">
            <div class="stat">
                <span class="stat-label">Score</span>
                <span class="stat-value">
                    <Trophy size={16} color="var(--warning)" />
                    {$score}
                </span>
            </div>
            <div class="stat">
                <span class="stat-label">Streak</span>
                <span class="stat-value {$streak >= 3 ? 'on-fire' : ''}">
                    <Flame size={16} color="var(--accent)" />
                    {$streak}
                </span>
            </div>
        </div>
    {/if}
</header>

<style>
    .header {
        width: 100%;
        padding: 36px 0 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--surface-border);
        margin-bottom: 40px;
        animation: slideUp 0.6s ease-out;
    }

    .logo {
        font-family: var(--font-heading);
        font-size: 28px;
        font-weight: 700;
        letter-spacing: 0.08em;
        color: var(--text-primary);
        text-transform: uppercase;
    }

    .logo span {
        color: var(--accent);
    }

    .tagline {
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--text-muted);
        letter-spacing: 0.15em;
        text-transform: uppercase;
        margin-top: 2px;
    }

    .score-bar {
        display: flex;
        gap: 24px;
        align-items: center;
    }

    .stat {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .stat-label {
        font-family: var(--font-mono);
        font-size: 10px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--text-muted);
        margin-bottom: 4px;
    }

    .stat-value {
        font-family: var(--font-heading);
        font-size: 20px;
        font-weight: 600;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .on-fire {
        color: var(--danger);
        text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
        animation: pulse 1s infinite alternate;
    }

    .on-fire :global(svg) {
        color: var(--danger);
    }

    @keyframes pulse {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(1.05);
        }
    }

    @media (max-width: 480px) {
        .header {
            padding: 24px 0 20px;
            margin-bottom: 24px;
        }
        .logo {
            font-size: 22px;
        }
        .stat-value {
            font-size: 18px;
        }
    }
</style>
