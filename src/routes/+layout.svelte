<script lang="ts">
	import '../app.css';
	import { ModeWatcher, toggleMode } from "mode-watcher";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="https://www.2048.org/favicon.ico" />
</svelte:head>


<ModeWatcher />
<div class="py-2 relative">
	<div class="absolute top-4 left-4">
		<button onclick={toggleMode} class="border rounded-xl px-2 py-1 cursor-pointer">THEME!</button>
	</div>
    {@render children()}
</div>
