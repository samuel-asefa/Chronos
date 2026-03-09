<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let question;
    export let timeLeft;
    export let answered;

    // Local state for slider
    let sliderValue;

    // Set initial slider value when question changes
    $: if (question && question.type === "slider") {
        const min = question.sliderRange[0];
        const max = question.sliderRange[1];
        sliderValue = Math.round((min + max) / 2);
    }

    let selectedOptionIdx = -1;
    $: if (!answered) selectedOptionIdx = -1; // Reset when new question

    function formatYear(y) {
        return y < 0 ? `${Math.abs(y)} BC` : y;
    }

    function handleMCOption(idx) {
        if (answered) return;
        selectedOptionIdx = idx;

        const isCorrect = idx === question.answer;
        const timeBonus = Math.max(0, timeLeft * 5);
        const pts = isCorrect ? 100 + timeBonus : 0;

        dispatch("answer", {
            isCorrect,
            partial: false,
            pts,
            correctAnswer: question.opts[question.answer],
            diff: null,
            grade: isCorrect ? "perfect" : "miss",
        });
    }

    function handleSliderSubmit() {
        if (answered) return;

        const guess = sliderValue;
        const actual = question.answer;
        const diff = Math.abs(guess - actual);

        let pts = 0,
            grade = "";
        if (diff === 0) {
            pts = 200 + timeLeft * 2;
            grade = "perfect";
        } else if (diff <= 2) {
            pts = 150;
            grade = "excellent";
        } else if (diff <= 5) {
            pts = 100;
            grade = "great";
        } else if (diff <= 10) {
            pts = 60;
            grade = "good";
        } else if (diff <= 20) {
            pts = 30;
            grade = "close";
        } else {
            pts = 0;
            grade = "miss";
        }

        const isCorrect = diff <= 5;
        const isPartial = diff > 5 && diff <= 20;

        dispatch("answer", {
            isCorrect,
            partial: isPartial,
            pts,
            correctAnswer: formatYear(actual),
            diff,
            grade,
        });
    }
</script>

<div class="q-card glass-panel" class:answered>
    <div class="q-meta">
        <span class="q-category">{question.cat}</span>
        <span class="q-type"
            >{question.type === "mc"
                ? "Multiple Choice"
                : "Timeline Slider"}</span
        >

        <div class="timer-ring">
            <svg width="36" height="36" viewBox="0 0 36 36">
                <circle class="timer-bg" cx="18" cy="18" r="16" />
                <circle
                    class="timer-arc"
                    cx="18"
                    cy="18"
                    r="16"
                    stroke-dasharray="100.53"
                    stroke-dashoffset={100.53 * (1 - timeLeft / 20)}
                    style="stroke: {timeLeft > 10
                        ? 'var(--accent)'
                        : timeLeft > 5
                          ? 'var(--warning)'
                          : 'var(--danger)'}"
                />
            </svg>
            <div class="timer-num" class:danger={timeLeft <= 5}>{timeLeft}</div>
        </div>
    </div>

    <h2 class="q-text">{question.text}</h2>
    {#if question.hint}
        <p class="q-hint">{question.hint}</p>
    {/if}

    <div class="interactive-area">
        {#if question.type === "mc"}
            <div class="mc-grid">
                {#each question.opts as opt, idx}
                    {@const isCorrectAns = answered && idx === question.answer}
                    {@const isWrongSelection =
                        answered &&
                        idx === selectedOptionIdx &&
                        idx !== question.answer}
                    <button
                        class="mc-btn"
                        class:correct={isCorrectAns}
                        class:wrong={isWrongSelection}
                        disabled={answered}
                        on:click={() => handleMCOption(idx)}
                    >
                        <span class="opt-letter"
                            >{["A", "B", "C", "D"][idx]}</span
                        >
                        <span class="opt-text">{opt}</span>
                    </button>
                {/each}
            </div>
        {:else}
            <div class="slider-wrap">
                <div class="year-display">{formatYear(sliderValue)}</div>
                <input
                    type="range"
                    class="range-input"
                    min={question.sliderRange[0]}
                    max={question.sliderRange[1]}
                    bind:value={sliderValue}
                    disabled={answered}
                />
                <div class="range-labels">
                    <span>{formatYear(question.sliderRange[0])}</span>
                    <span>{formatYear(question.sliderRange[1])}</span>
                </div>
                <button
                    class="btn-submit glass-panel"
                    disabled={answered}
                    on:click={handleSliderSubmit}
                >
                    Lock In Answer
                </button>
            </div>
        {/if}
    </div>
</div>

<style>
    .q-card {
        padding: 32px 36px;
        margin-bottom: 24px;
        animation: slideUp 0.4s ease-out;
    }

    .q-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;
    }

    .q-category,
    .q-type {
        font-family: var(--font-mono);
        font-size: 11px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 4px 12px;
        border-radius: var(--radius-full);
    }

    .q-category {
        background: var(--accent-glow);
        color: #60a5fa;
        border: 1px solid rgba(96, 165, 250, 0.2);
    }

    .q-type {
        background: var(--surface-border);
        color: var(--text-muted);
    }

    .timer-ring {
        margin-left: auto;
        position: relative;
        width: 36px;
        height: 36px;
    }

    .timer-ring svg {
        transform: rotate(-90deg);
    }

    .timer-bg {
        fill: none;
        stroke: var(--surface-border);
        stroke-width: 3;
    }

    .timer-arc {
        fill: none;
        stroke-width: 3;
        stroke-linecap: round;
        transition:
            stroke-dashoffset 1s linear,
            stroke 0.3s;
    }

    .timer-num {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-mono);
        font-size: 13px;
        font-weight: 600;
    }

    .timer-num.danger {
        color: var(--danger);
        animation: pulse 1s infinite alternate;
    }

    .q-text {
        font-size: 24px;
        line-height: 1.4;
        color: var(--text-primary);
        margin-bottom: 12px;
    }

    .q-hint {
        font-size: 14px;
        color: var(--text-muted);
        font-style: italic;
        margin-bottom: 32px;
    }

    /* MC Options */
    .mc-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }

    .mc-btn {
        background: var(--surface);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-sm);
        padding: 16px 20px;
        text-align: left;
        display: flex;
        align-items: center;
        gap: 16px;
        font-size: 15px;
        color: var(--text-primary);
        transition: all 0.2s;
    }

    .mc-btn:not(:disabled):hover {
        background: var(--surface-hover);
        border-color: var(--accent);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    }

    .opt-letter {
        font-family: var(--font-mono);
        font-size: 12px;
        color: var(--text-muted);
        background: rgba(255, 255, 255, 0.05);
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
    }

    .mc-btn:not(:disabled):hover .opt-letter {
        color: var(--accent);
        background: var(--accent-glow);
    }

    .mc-btn.correct {
        background: var(--success-bg);
        border-color: var(--success);
        color: #fff;
    }

    .mc-btn.correct .opt-letter {
        background: var(--success);
        color: #fff;
    }

    .mc-btn.wrong {
        background: var(--danger-bg);
        border-color: var(--danger);
        opacity: 0.8;
    }

    .mc-btn.wrong .opt-letter {
        background: var(--danger);
        color: #fff;
    }

    .mc-btn:disabled {
        cursor: default;
    }

    /* Slider */
    .slider-wrap {
        text-align: center;
        padding: 10px 0;
    }

    .year-display {
        font-family: var(--font-heading);
        font-weight: 700;
        font-size: 56px;
        color: var(--accent);
        margin-bottom: 24px;
        line-height: 1;
        text-shadow: 0 0 20px var(--accent-glow);
    }

    .range-input {
        width: 100%;
        -webkit-appearance: none;
        appearance: none;
        height: 6px;
        background: var(--surface-border);
        border-radius: 3px;
        outline: none;
        margin-bottom: 12px;
    }

    .range-input::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--text-primary);
        cursor: pointer;
        border: 4px solid var(--accent);
        box-shadow: 0 0 12px var(--accent-glow);
        transition: transform 0.1s;
    }

    .range-input:not(:disabled)::-webkit-slider-thumb:hover {
        transform: scale(1.2);
    }

    .range-input:disabled::-webkit-slider-thumb {
        background: var(--text-muted);
        border-color: var(--surface-border);
        box-shadow: none;
    }

    .range-labels {
        display: flex;
        justify-content: space-between;
        font-family: var(--font-mono);
        font-size: 12px;
        color: var(--text-muted);
        margin-bottom: 32px;
    }

    .btn-submit {
        width: 100%;
        padding: 16px;
        font-weight: 600;
        font-size: 15px;
        color: var(--text-primary);
        letter-spacing: 0.05em;
        text-transform: uppercase;
        transition: all 0.2s;
    }

    .btn-submit:not(:disabled):hover {
        background: var(--accent);
        border-color: var(--accent);
        color: #fff;
        box-shadow: 0 8px 24px var(--accent-glow);
    }

    .btn-submit:disabled {
        opacity: 0.5;
    }

    @media (max-width: 640px) {
        .q-card {
            padding: 24px 20px;
        }
        .mc-grid {
            grid-template-columns: 1fr;
        }
        .q-text {
            font-size: 20px;
        }
    }
</style>
