<script lang="ts">
	import Button from "./Button.svelte";

    interface Props {
        score: number;
        best: number;
        onStartNewGameClick: () => void;
        scoreAnimationValue: number;
        showScoreAnimationValue: boolean;
        animationValueSpan: HTMLSpanElement;
    }
    let { score, best, onStartNewGameClick, scoreAnimationValue, showScoreAnimationValue, animationValueSpan = $bindable() }:Props = $props();
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
                    New Game
                </Button>
            </div>


            <div class="flex gap-2">
                <span class="p-1.5 rounded-lg min-w-28 flex flex-col text-center bg-board text-tile-text font-medium text-lg leading-5">
                    <p class="text-sm">SCORE:</p>
                    <p class="text-2xl font-bold relative">
                        {score}
                        <span bind:this={animationValueSpan}
                            class={[
                                "absolute top-0 left-1/2 text-tile-text-alt whitespace-nowrap",
                                { "opacity-0": !showScoreAnimationValue }
                            ]}
                        >
                           + {scoreAnimationValue}
                        </span>
                    </p>
                </span>
                <span class="p-1.5 rounded-lg min-w-28 flex flex-col text-center bg-board text-tile-text font-medium text-lg leading-5">
                    <p class="text-sm">BEST:</p>
                    <p class="text-2xl font-bold">{best}</p>
                </span>
            </div>
        </div>
    </div>
</header>