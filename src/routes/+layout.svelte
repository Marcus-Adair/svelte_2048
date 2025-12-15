<script lang="ts">
	import '../app.css';
	import ThemeWatcher from '$lib/components/ThemeWatcher.svelte';
	import ThemePopover from '$lib/components/ThemePopover.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="https://www.2048.org/favicon.ico" />
</svelte:head>

<ThemeWatcher />
<div class="relative min-w-[650px]">
	<div class="absolute right-4 text-2xl flex flex-col gap-2">
		<ThemePopover/>
	</div>

    {@render children()}
</div>
