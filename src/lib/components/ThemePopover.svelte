<script lang="ts">
  import Button from "./Button.svelte";
  import { theme, type Theme } from '$lib/utils/ui';
  import { Paintbrush } from "lucide-svelte";
  import gsap from "gsap";
  // -------------------------------------------------- //

  let menuDiv = $state<HTMLDivElement | undefined>(undefined); 
  function openPopover() {
      isOpen = true;
      gsap.fromTo(menuDiv!, { opacity: 0 }, { opacity: 1, duration: 0.1});
      gsap.fromTo( menuDiv!, { height: 0},  { height: "auto", duration: 0.18, ease: "power2.out" } );

  }
  function closePopover() {
      gsap.fromTo(menuDiv!, { opacity: 1 }, { opacity: 0, duration: 0.09, onComplete: () => { isOpen = false }});
      gsap.to( menuDiv!, { height: 0, duration: 0.08, ease: "power2.out"} );
  }

  let isOpen = $state(false);
  let openTrigger = $state<HTMLButtonElement | undefined>(undefined);

  // Click outside the Popover to close it
  function clickOutside(
      node: HTMLDivElement,
      options: { ignore?: HTMLElement | null } = {}
  ) {
      const handleClick = (e: MouseEvent) => {
          const target = e.target as Node;
          if (node.contains(target) || options.ignore?.contains(target)) return;
          closePopover();
      };

      document.addEventListener("mousedown", handleClick, true);
      return { destroy() { document.removeEventListener("mousedown", handleClick, true); } };
  }

  function onclick() { if (!isOpen) { openPopover(); } else { closePopover(); }}

  function setTheme(value: Theme) {
      theme.set(value);
      closePopover();
  }
</script>


<div class="flex flex-col gap-2">
    <div class="flex justify-end z-50">
      <Button
        bind:thisButton={openTrigger}
        {onclick}
        title="See themes"
      >
        <Paintbrush />
      </Button>
    </div>
  
    <div
      bind:this={menuDiv}
      use:clickOutside={{ ignore: openTrigger }}
      class={[
          "overflow-clip h-auto w-auto border-3 border-board bg-background text-md rounded-lg flex flex-col z-50 shadow-sm",
          {"hidden": !isOpen}
      ]}
    >
        <span class="text-sm py-1 px-2 bg-board/10">CHOOSE THEME:</span>
        {@render Separator()}

        <button class="cursor-pointer bg-board/10 hover:bg-board/25 px-3 py-1.5 text-end" onclick={() => setTheme("theme-classic")}>
            CLASSIC
        </button>
        {@render Separator()}
  
        <button class="cursor-pointer bg-board/10 hover:bg-board/25 px-3 py-1.5 text-end" onclick={() => setTheme("theme-dark")}
        >
            DARK
        </button>
        {@render Separator()}
  
        <button class="cursor-pointer bg-board/10 hover:bg-board/25 px-3 py-1.5 text-end rounded-b-md"
          onclick={() => setTheme("theme-cyberpunk")}
        >
            CYBERPUNK
        </button>
    </div>
</div>
  
{#snippet Separator()}
  <div class="w-full h-[3px] bg-board/50"></div>
{/snippet}

