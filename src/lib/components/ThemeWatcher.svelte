<script lang="ts">
	import { theme, type Theme } from "$lib/utils/ui";
	import { onMount } from "svelte";

	const THEMES: Theme[] = [
		"theme-classic",
		"theme-dark",
		"theme-cyberpunk"
	] as const;

	onMount(() => {
		const unsubscribe = theme.subscribe((t) => {
			const el = document.documentElement;

			el.classList.remove(...THEMES);
			el.classList.add(t);
		});

		return unsubscribe;
	});
</script>
