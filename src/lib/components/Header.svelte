<script lang="ts">
    interface Props {
        score: number;
        best: number;
        onStartNewGameClick: () => void;
    }
    let { score, best, onStartNewGameClick }:Props = $props();
</script>

<header class="flex justify-center mt-6">
    <div class="flex w-[450px] justify-between">
        <div class="flex flex-col gap-2">
            <span class="text-8xl font-bold tracking-tight">2048</span>
            <span class="text-xl w-60 px-1">Join numbers to get to the <span class="font-semibold">2048</span> tile!</span>
        </div>

        <div class="flex flex-col justify-between gap-12">
            <div class="flex justify-end translate-y-4">
                <div class="flex flex-col gap-2">
                    <span class="border p-2 rounded-lg w-34 flex justify-between">
                        <p>Score:</p>
                        <p>{score}</p>
                    </span>
                    <!-- <span class="border p-2 rounded-sm w-34 flex justify-between">
                        <p>Best:</p>
                        <p>{best}</p>
                    </span> -->
                </div>
            </div>

            <div class="flex justify-end">
                <button
                    class="w-28 py-2 bg-button text-tile-text-light font-semibold rounded-lg cursor-pointer hover:bg-button/90"
                    onclick={onStartNewGameClick}
                    title="Start a new game"
                >
                    New Game
                </button>
            </div>
        </div>
    </div>
</header>