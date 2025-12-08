<script lang="ts">
	import '../app.css';
	import { ModeWatcher, toggleMode } from "mode-watcher";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="https://www.2048.org/favicon.ico" />
</svelte:head>

<ModeWatcher />
<div class="relative">
	<div class="absolute top-2 left-4">
		<button onclick={toggleMode} class="border rounded-xl px-2 py-1 cursor-pointer" title="Toggle theme">
			THEME!
		</button>
	</div>
    {@render children()}
</div>
