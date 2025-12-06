<script lang="ts">
    interface Props {
        score: number;
        best: number;
    }
    let { score, best }:Props = $props();
</script>

<header class="flex justify-center mt-6">
    <div class="flex w-[450px] justify-between">
        <div class="flex flex-col">
            <span class="text-8xl font-bold">2048</span>
            <span class="text-lg">Join numbers to get to the <span class="font-semibold">2048</span> tile!</span>
        </div>
        <div class="flex flex-col justify-between gap-12">
            <div class="flex justify-end">
                <div class="flex flex-col gap-2">
                    <span class="border p-2 rounded-sm w-34 flex justify-between">
                        <p>Score:</p>
                        <p>{score}</p>
                    </span>
                    <span class="border p-2 rounded-sm w-34 flex justify-between">
                        <p>Best:</p>
                        <p>{best}</p>
                    </span>
                </div>
            </div>

            <button class="border w-38 py-1.5 rounded-sm">Start new game</button>
        </div>
    </div>
</header>