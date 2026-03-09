<script>
    import {
        currentQuestions,
        currentQuestionIdx,
        score,
        lives,
        streak,
        bestStreak,
        recordResult,
        advanceQuestion,
        endGame,
    } from "../lib/store.js";
    import QuestionCard from "./QuestionCard.svelte";
    import {
        CheckCircle2,
        XCircle,
        AlertCircle,
        ArrowRight,
    } from "lucide-svelte";

    // Timer state
    let timeLeft = 20;
    let timerInterval;

    // Answer state
    let answered = false;
    let currentResult = null; // { isCorrect, partial, pts, correctAnswer, diff, grade, timeout, explanation }

    $: question = $currentQuestions[$currentQuestionIdx];
    $: progressPct = ($currentQuestionIdx / $currentQuestions.length) * 100;
    $: {
        // Reset when question changes
        if (question) {
            answered = false;
            currentResult = null;
            startTimer();
        }
    }

    function startTimer() {
        clearInterval(timerInterval);
        timeLeft = 20;
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                onTimeout();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function onAnswer(event) {
        if (answered) return;
        answered = true;
        stopTimer();

        const { isCorrect, partial, pts, correctAnswer, diff, grade } =
            event.detail;
        processAnswer(
            isCorrect,
            partial,
            pts,
            correctAnswer,
            diff,
            grade,
            false,
        );
    }

    function onTimeout() {
        if (answered) return;
        answered = true;

        let correctAnswer =
            question.type === "mc"
                ? question.opts[question.answer]
                : question.answer;
        if (question.type === "slider" && correctAnswer < 0)
            correctAnswer = `${Math.abs(correctAnswer)} BC`;

        processAnswer(false, false, 0, correctAnswer, null, null, true);
    }

    function processAnswer(
        isCorrect,
        partial,
        pts,
        correctAnswer,
        diff,
        grade,
        timeout,
    ) {
        let finalPts = pts;

        // Apply streak multiplier
        const currentStreak = isCorrect && !partial ? $streak + 1 : 0;
        const multiplier = Math.min(Math.max(1, currentStreak), 3);

        if (isCorrect && !partial) {
            finalPts = pts * multiplier;
            score.update((s) => s + finalPts);
            streak.set(currentStreak);
            if (currentStreak > $bestStreak) bestStreak.set(currentStreak);

            currentResult = {
                status: "correct",
                title:
                    currentStreak >= 3
                        ? `Correct! ×${multiplier} Streak Bonus!`
                        : "Correct!",
                detail: `+${finalPts} pts${diff !== null ? ` — Off by ${diff} year${diff !== 1 ? "s" : ""}` : ""} · ${question.explanation}`,
                icon: CheckCircle2,
            };
        } else if (partial) {
            streak.set(0);
            score.update((s) => s + finalPts);
            lives.update((l) => l - 1);

            currentResult = {
                status: "partial",
                title: `Close! Off by ${diff} years`,
                detail: `+${finalPts} pts · Correct answer: ${correctAnswer} · ${question.explanation}`,
                icon: AlertCircle,
            };
        } else {
            streak.set(0);
            lives.update((l) => l - 1);

            currentResult = {
                status: "wrong",
                title: timeout ? "Time's Up!" : "Incorrect",
                detail: `Correct answer: ${correctAnswer} · ${question.explanation}`,
                icon: timeout ? AlertCircle : XCircle,
            };
        }

        recordResult({
            q: question,
            isCorrect: isCorrect && !partial,
            partial,
            pts: finalPts,
            timeout,
        });
    }

    function next() {
        if (
            $lives <= 0 ||
            $currentQuestionIdx + 1 >= $currentQuestions.length
        ) {
            endGame();
        } else {
            advanceQuestion();
        }
    }
</script>

<div class="screen">
    <!-- Progress & Lives -->
    <div class="header-row">
        <div class="lives-display">
            {#each Array(3) as _, i}
                <div class="life {i >= $lives ? 'lost' : ''}"></div>
            {/each}
        </div>
        <div class="progress-track">
            <div class="progress-fill" style="width: {progressPct}%"></div>
        </div>
        <div class="progress-label">
            {$currentQuestionIdx + 1} / {$currentQuestions.length}
        </div>
    </div>

    <QuestionCard {question} {timeLeft} {answered} on:answer={onAnswer} />

    {#if currentResult}
        <div
            class="feedback-bar fb-{currentResult.status}"
            style="animation: slideUp 0.3s ease-out;"
        >
            <div class="fb-icon">
                <svelte:component this={currentResult.icon} size={20} />
            </div>
            <div class="fb-content">
                <div class="fb-title">{currentResult.title}</div>
                <div class="fb-detail">{currentResult.detail}</div>
            </div>
        </div>

        <div
            class="next-row"
            style="animation: fadeIn 0.4s ease-out 0.1s both;"
        >
            <button class="btn-next glass-panel" on:click={next}>
                {$lives <= 0 ||
                $currentQuestionIdx + 1 >= $currentQuestions.length
                    ? "See Results"
                    : "Next Question"}
                <ArrowRight size={16} />
            </button>
        </div>
    {/if}
</div>

<style>
    .screen {
        width: 100%;
        animation: fadeIn 0.5s ease-out;
    }

    .header-row {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 32px;
    }

    .lives-display {
        display: flex;
        gap: 6px;
    }

    .life {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--accent);
        box-shadow: 0 0 10px var(--accent-glow);
        transition: all 0.3s;
    }

    .life.lost {
        background: var(--surface-border);
        box-shadow: none;
    }

    .progress-track {
        flex: 1;
        height: 4px;
        background: var(--surface);
        border-radius: 2px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background: var(--accent);
        box-shadow: 0 0 10px var(--accent-glow);
        border-radius: 2px;
        transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .progress-label {
        font-family: var(--font-mono);
        font-size: 12px;
        color: var(--text-muted);
        font-weight: 500;
    }

    /* Feedback */
    .feedback-bar {
        border-radius: var(--radius-md);
        padding: 16px 20px;
        margin-bottom: 24px;
        display: flex;
        align-items: flex-start;
        gap: 16px;
        background: var(--surface);
        border: 1px solid var(--surface-border);
        box-shadow: var(--shadow-glass);
    }

    .fb-correct {
        background: var(--success-bg);
        border-color: rgba(16, 185, 129, 0.3);
        color: var(--success);
    }

    .fb-wrong {
        background: var(--danger-bg);
        border-color: rgba(239, 68, 68, 0.3);
        color: var(--danger);
    }

    .fb-partial {
        background: var(--warning-bg);
        border-color: rgba(245, 158, 11, 0.3);
        color: var(--warning);
    }

    .fb-title {
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 4px;
    }

    .fb-detail {
        font-size: 14px;
        opacity: 0.9;
        line-height: 1.5;
        color: var(--text-primary);
    }

    .next-row {
        display: flex;
        justify-content: flex-end;
    }

    .btn-next {
        padding: 12px 24px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        font-size: 14px;
        color: var(--text-primary);
        transition: all 0.2s;
    }

    .btn-next:hover {
        background: var(--surface-hover);
        border-color: var(--accent);
        color: var(--accent);
        transform: translateX(2px);
    }
</style>
