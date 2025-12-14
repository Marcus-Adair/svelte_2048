
<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";

    type ButtonProps = {
        thisButton?: HTMLButtonElement;
        children: Snippet;
        onclick: () => void;
    } & HTMLButtonAttributes
    let { thisButton = $bindable(), children, onclick, ...props }: ButtonProps = $props();
</script>

<button
    bind:this={thisButton}
    {...props}
    {onclick}
    class={[
        "w-fit h-fit px-3.5 py-2 bg-button text-tile-text text-xl font-semibold rounded-lg cursor-pointer hover:bg-button/90 shadow-xs focus:outline-none focus:ring-0",
        props.class
    ]}
    
>
    {@render children()}
</button>