<script lang="ts">
	import gsap from "gsap";
	import Button from "./Button.svelte";

	interface Props {
		score: number;
		onClose: () => void;
	}
	let { score, onClose }: Props = $props();
</script>

<script lang="ts" module>
    let dialog: HTMLDialogElement;
	export function openGameOverDialog() {
		dialog?.showModal();
		gsap.fromTo(dialog, {y: 1000}, {y: 0, duration: 0.36, ease: "power1.inOut"})
	}
	export function closeGameOverDialog() {	
		gsap.to(dialog, {
			y: 1000,
			duration: 0.12,
			ease: "power1.inOut",
			onComplete: () => dialog?.close()
		})
	}
</script>

<dialog
	bind:this={dialog}
	class="bg-transparent rounded-2xl focus:outline-none focus:ring-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
	onclick={(e) => e.target === dialog && close()}
>
	<div class="rounded-2xl text-foreground border-3 border-board px-7 py-10 bg-background min-w-[524px] flex flex-col gap-6">
		<h1 class="font-bold text-4xl text-center">GAME OVER!</h1>

		<div class="bg-board rounded-lg text-3xl text-tile-text flex justify-between gap-4 py-4 px-5">
			<span class="font-medium">SCORE:</span>
			<span class="font-semibold">{score}</span>
		</div>

		<Button
			id="start-new-game-on-over"
			onclick={() => {
				closeGameOverDialog();
				onClose();
			}}
			title="Start new game"
			class="w-full mt-8 py-3! text-3xl!"
		>

			START NEW GAME
		</Button>
	</div>
</dialog>