<script lang="ts">
	import type { BestIndex, ScoreIndex } from "$lib/types";
	import Button from "./Button.svelte";

    interface Props {
        score: number;
        best: number;
        onStartNewGameClick: () => void;
        score0: HTMLSpanElement;
        score1: HTMLSpanElement;
        score2: HTMLSpanElement;
        score3: HTMLSpanElement;
        score4: HTMLSpanElement;
        score5: HTMLSpanElement;
        scoreIdxClassMap: Record<ScoreIndex, string | undefined>;
        scoreIdxValueMap: Record<ScoreIndex, number | undefined>;
        best0: HTMLSpanElement;
        best1: HTMLSpanElement;
        best2: HTMLSpanElement;
        best3: HTMLSpanElement;
        best4: HTMLSpanElement;
        best5: HTMLSpanElement;
        bestIdxClassMap: Record<BestIndex, string | undefined>;
        bestIdxValueMap: Record<BestIndex, number | undefined>;
    }
    let {
        score0 = $bindable(), score1 = $bindable(), score2 = $bindable(), score3 = $bindable(), score4 = $bindable(), score5 = $bindable(),
        scoreIdxClassMap, scoreIdxValueMap,
        score,
        best0 = $bindable(), best1 = $bindable(), best2 = $bindable(), best3 = $bindable(), best4 = $bindable(), best5 = $bindable(),
        bestIdxClassMap, bestIdxValueMap,
        best,
        onStartNewGameClick 
    }:Props = $props();
</script>

<header class="flex justify-center mt-4">
    <div class="flex flex-col gap-2 w-[450px]">
        <div class="flex justify-between gap-2">
            <span class="text-[90px] leading-none font-bold tracking-tight">2048</span>
            <span class="text-xl w-70 px-1 leading-tight text-end translate-y-4">
                Join numbers to get to the <span class="font-semibold">2048</span> tile!
            </span>
        </div>

        <div class="flex justify-between gap-12">
            <div class="flex flex-col justify-end">
                <Button
                    onclick={onStartNewGameClick}
                    title="Start a new game"
                >
                    NEW GAME
                </Button>
            </div>


            <div class="flex gap-2">
                <span class="p-1.5 rounded-lg min-w-28 flex flex-col text-center bg-board text-tile-text font-medium text-lg leading-5">
                    <p class="text-sm">SCORE:</p>

                    <p class="text-2xl font-bold relative">
                        {score}
                        <span bind:this={score0} class={[ "animated-score", {"hidden": scoreIdxClassMap["score0"] === undefined} ]}>
                           + {scoreIdxValueMap["score0"]}
                        </span>
                        <span bind:this={score1} class={[ "animated-score", {"hidden": scoreIdxClassMap["score1"] === undefined} ]}>
                           + {scoreIdxValueMap["score1"]}
                        </span>
                        <span bind:this={score2} class={[ "animated-score", {"hidden": scoreIdxClassMap["score2"] === undefined} ]}>
                           + {scoreIdxValueMap["score2"]}
                        </span>
                        <span bind:this={score3} class={[ "animated-score", {"hidden": scoreIdxClassMap["score3"] === undefined} ]}>
                           + {scoreIdxValueMap["score3"]}
                        </span>
                        <span bind:this={score4} class={[ "animated-score", {"hidden": scoreIdxClassMap["score4"] === undefined} ]}>
                           + {scoreIdxValueMap["score4"]}
                        </span>
                        <span bind:this={score5} class={[ "animated-score", {"hidden": scoreIdxClassMap["score5"] === undefined} ]}>
                           + {scoreIdxValueMap["score5"]}
                        </span>
                    </p>
                </span>
                <span class="p-1.5 rounded-lg min-w-28 flex flex-col text-center bg-board text-tile-text font-medium text-lg leading-5">
                    <p class="text-sm">BEST:</p>
                    <p class="text-2xl font-bold relative">
                        {best}
                        <span bind:this={best0} class={[ "animated-score", {"hidden": bestIdxClassMap["best0"] === undefined} ]}>
                            + {bestIdxValueMap["best0"]}
                         </span>
                         <span bind:this={best1} class={[ "animated-score", {"hidden": bestIdxClassMap["best1"] === undefined} ]}>
                            + {bestIdxValueMap["best1"]}
                         </span>
                         <span bind:this={best2} class={[ "animated-score", {"hidden": bestIdxClassMap["best2"] === undefined} ]}>
                            + {bestIdxValueMap["best2"]}
                         </span>
                         <span bind:this={best3} class={[ "animated-score", {"hidden": bestIdxClassMap["best3"] === undefined} ]}>
                            + {bestIdxValueMap["best3"]}
                         </span>
                         <span bind:this={best4} class={[ "animated-score", {"hidden": bestIdxClassMap["best4"] === undefined} ]}>
                            + {bestIdxValueMap["best4"]}
                         </span>
                         <span bind:this={best5} class={[ "animated-score", {"hidden": bestIdxClassMap["best5"] === undefined} ]}>
                            + {bestIdxValueMap["best5"]}
                         </span>
                    </p>
                </span>
            </div>
        </div>
    </div>
</header>