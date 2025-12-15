<script lang="ts">
	import '../app.css';
	import ThemeWatcher from '$lib/components/ThemeWatcher.svelte';
	import ThemePopover from '$lib/components/ThemePopover.svelte';
	import { CodeXml } from 'lucide-svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="https://www.2048.org/favicon.ico" />
</svelte:head>

<ThemeWatcher />
<div class="relative min-w-[650px]">
	<a
		class="absolute left-2 z-50 hover:bg-button/10 px-4 py-2 rounded-lg"
		href="https://github.com/Marcus-Adair/svelte_2048"
		title="See the code"
		target="_blank"
	>
		<CodeXml size={28}/>
	</a>
	<div class="absolute right-4 text-2xl flex flex-col gap-2">
		<ThemePopover/>
	</div>

    {@render children()}
</div>
