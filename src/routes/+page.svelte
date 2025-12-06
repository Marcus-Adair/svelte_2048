<script lang="ts">
	import Header from "$lib/components/Header.svelte";
    import { type BoardSlotIdx, type GameState, type RefIndex } from "$lib/types";
	import { createBoardSlotIdx, getCoordsFromBoardSlotIdx, initNewGameState } from "$lib/utils/game";
	import { onMount } from "svelte";
    import gsap from "gsap";

    //  16 playable tiles to move and animate around
    let tile0: HTMLDivElement;
    let tile1: HTMLDivElement;
    // let tile2: HTMLDivElement;
    // let tile3: HTMLDivElement;
    // let tile4: HTMLDivElement;
    // let tile5: HTMLDivElement;
    // let tile6: HTMLDivElement;
    // let tile7: HTMLDivElement;
    // let tile8: HTMLDivElement;
    // let tile9: HTMLDivElement;
    // let tile10: HTMLDivElement;
    // let tile11: HTMLDivElement;
    // let tile12: HTMLDivElement;
    // let tile13: HTMLDivElement;
    // let tile14: HTMLDivElement;
    // let tile15: HTMLDivElement;

    // Maps refIdx to class .. TODO: USE THIS TO COLOR TILES!!! i think 
    let refIdxClassMap = $state<Record<RefIndex, string | undefined>>({
        tile0: undefined, tile1: undefined, tile2: undefined, tile3: undefined,
        tile4: undefined, tile5: undefined, tile6: undefined, tile7: undefined,
        tile8: undefined, tile9: undefined, tile10: undefined, tile11: undefined,
        tile12: undefined, tile13: undefined, tile14: undefined, tile15: undefined  
    });
    let refIdxValueMap = $state<Record<RefIndex, number | undefined>>({
        tile0: undefined, tile1: undefined, tile2: undefined, tile3: undefined,
        tile4: undefined, tile5: undefined, tile6: undefined, tile7: undefined,
        tile8: undefined, tile9: undefined, tile10: undefined, tile11: undefined,
        tile12: undefined, tile13: undefined, tile14: undefined, tile15: undefined  
    });

    let gameState = $state<GameState>(initNewGameState());

        
    function initNewGameUI(newGamePressed?: boolean) {
        const tiles = {
            tile0,
            tile1
        };
        Object.entries(tiles).forEach(([tileRefIdx, tile]) => {
            Object.entries(gameState.board).forEach(([boardSlotIdx, boardSlot]) => {

                // If Tile in boardSlot, and refIndex matches
                if (boardSlot?.refIndex === tileRefIdx){
                    const [curX, curY] = getCoordsFromBoardSlotIdx(boardSlotIdx as BoardSlotIdx);
                    const xTrans = curX * 110;
                    const yTrans = curY * 110;

                    refIdxClassMap[tileRefIdx] =  "don't-hide"
                    refIdxValueMap[tileRefIdx] = gameState.board[boardSlotIdx as BoardSlotIdx]?.value

                    const tl = gsap.timeline();
                    if (newGamePressed) {
                        tl.to(tile, {
                            scale: 0,
                            duration: 0.115,
                            ease: "power4.out"
                        });
                    } else {
                        tl.to(tile, { scale: 0, duration: 0  });
                    }

                    tl.to(
                        tile, {
                        x: xTrans,
                        y: yTrans,
                        duration: 0
                    });
                    tl.to(tile, {
                        delay: newGamePressed ? 0 : 0.15,
                        scale: 1,
                        duration: 0.15,
                        ease: "power4.out"
                    });
                }
            })
        });
    }

    onMount(() => {
        initNewGameUI();
    });

    function startNewGame() {
        gameState = initNewGameState();
        initNewGameUI(true);
    }

    let isMoving = $state(false);

    function handleKeydown(event: KeyboardEvent) {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
        event.preventDefault();
        
        if (isMoving) return;

        const tiles = {
            tile0,
            tile1,
            // tile2,
            // tile3,
            // tile4,
            // tile5,
            // tile6,
            // tile7,
            // tile8,
            // tile9,
            // tile10,
            // tile11,
            // tile12,
            // tile13,
            // tile14,
            // tile15,
        };

        // ------------------------------------------------------------------------------------------------- //

        // TODO: I need to make a sliding algorithm, where i iterate Row by row, from front to back ... 
        // I can use transpose to somehow make one sliding algorithm ,, do a transpose on the resulting coords and then do an animation after that

            // - the algo needs to rotate board --> do a slide -->  rotate back --> animate tile to new slotIdxs
        // ------------------------------------------------------------------------------------------------- //


        Object.entries(tiles).forEach(([tileRefIdx, tile]) => {

                // Get the matching boardSlotIdx to extract x,y 
                let matchingBoardSlotIdx;
                Object.entries(gameState.board).forEach(([boardSlotIdx, boardSlot]) => {
                    if (boardSlot?.refIndex === tileRefIdx){
                        matchingBoardSlotIdx = boardSlotIdx;
                    }
                })
                if (!matchingBoardSlotIdx) return;
                
                const [curX, curY] = getCoordsFromBoardSlotIdx(matchingBoardSlotIdx);
                if (event.key === 'ArrowUp') {
                    if (curY !== 0) {

                        isMoving = true;
                        gsap.to(tile, {
                            y: "-=110",
                            duration: 0.2,
                            ease: "power4.inOut",
                            onComplete: () => {
                                isMoving = false;
                            }
                        });

                        const newCoords = createBoardSlotIdx(curX, curY - 1);
                        const existingTile = gameState.board[matchingBoardSlotIdx];
                        gameState.board[newCoords] = existingTile; // update
                        gameState.board[matchingBoardSlotIdx as BoardSlotIdx] = undefined; // empty old one
                    }
                } else if (event.key === 'ArrowDown') {
                    if (curY !== 3) {
                        isMoving = true;
                        gsap.to(tile, {
                            y: "+=110",
                            duration: 0.2,
                            ease: "power4.inOut",
                            onComplete: () => {
                                isMoving = false;
                            }
                        });

                        const newCoords = createBoardSlotIdx(curX, curY + 1);
                        const existingTile = gameState.board[matchingBoardSlotIdx];
                        gameState.board[newCoords] = existingTile;
                        gameState.board[matchingBoardSlotIdx as BoardSlotIdx] = undefined;
                    }
                } else if (event.key === 'ArrowLeft') {
                    if (curX !== 0) {
                        isMoving = true;
                        gsap.to(tile, {
                            x: "-=110",
                            duration: 0.2,
                            ease: "power4.inOut",
                            onComplete: () => {
                                isMoving = false;
                            }
                        });

                        const newCoords = createBoardSlotIdx(curX - 1, curY);
                        const existingTile = gameState.board[matchingBoardSlotIdx];
                        gameState.board[newCoords] = existingTile;
                        gameState.board[matchingBoardSlotIdx as BoardSlotIdx] = undefined;
                    }
                } else if (event.key === 'ArrowRight') {
                    if (curX !== 3) {
                        isMoving = true;
                        gsap.to(tile, {
                            x: "+=110",
                            duration: 0.2,
                            ease: "power4.inOut",
                            onComplete: () => {
                                isMoving = false;
                            }
                        });

                        const newCoords = createBoardSlotIdx(curX + 1, curY);
                        const existingTile = gameState.board[matchingBoardSlotIdx];
                        gameState.board[newCoords] = existingTile;
                        gameState.board[matchingBoardSlotIdx as BoardSlotIdx] = undefined;
                    }
                }
        });
    }
</script>

<svelte:head><title>2048</title></svelte:head>
<svelte:window on:keydown={handleKeydown} />




<!-- UI -->
 <div>
    <Header score={gameState.score} best={-1} onStartNewGameClick={startNewGame}/>

    <!-- 450px is the width of the board -->
    <main class="flex justify-center p-4 my-1.5 ">
        <div
            id="game-board"
            class="grid grid-cols-4 gap-2.5 rounded-xl bg-[#bbada0] p-2.5 relative"
        >
            {#each Array(16)}<div class="rounded-xl bg-[#ccc0b3] h-[100px] w-[100px] shadow-sm"></div>{/each}

            <div id="tiles" class="absolute top-0 left-0 p-2.5 h-[450px] w-[450px]">
                <div class="relative">
                    <div bind:this={tile0} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center bg-[#eee4da]", {"opacity-0": !refIdxClassMap["tile0"]}, `${refIdxClassMap["tile0"] ? refIdxClassMap["tile0"] : ""}`]}><span class=" text-gray-600 text-4xl font-bold">{refIdxValueMap["tile0"] ?? "noval"}</span></div>
                    <div bind:this={tile1} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center bg-[#eee4da]", {"opacity-0": !refIdxClassMap["tile1"]}, `${refIdxClassMap["tile1"] ? refIdxClassMap["tile1"] : ""}`]}><span class=" text-gray-600 text-4xl font-bold">{refIdxValueMap["tile1"] ?? "noval"}</span></div>
                    <!-- <div bind:this={tile2} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center bg-[#eee4da]", {"opacity-0": refIdxClassMap["tile2"]}, `${refIdxClassMap["tile2"] ? refIdxClassMap["tile2"] : ""}`]}><span class=" text-gray-600 text-4xl font-bold">X</span></div>
                    <div bind:this={tile3} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center bg-[#eee4da]", {"opacity-0": refIdxClassMap["tile3"]}, `${refIdxClassMap["tile3"] ? refIdxClassMap["tile3"] : ""}`]}><span class=" text-gray-600 text-4xl font-bold">X</span></div>
        
                    <div bind:this={tile4} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center bg-[#eee4da]", {"opacity-0": refIdxClassMap["tile4"]}, `${refIdxClassMap["tile4"] ? refIdxClassMap["tile4"] : ""}`]}><span class=" text-gray-600 text-4xl font-bold">X</span></div>
                    <div bind:this={tile5} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center bg-[#eee4da]", {"opacity-0": refIdxClassMap["tile5"]}, `${refIdxClassMap["tile5"] ? refIdxClassMap["tile5"] : ""}`]}><span class=" text-gray-600 text-4xl font-bold">X</span></div>
                    <div bind:this={tile6} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center bg-[#eee4da]", {"opacity-0": refIdxClassMap["tile6"]}, `${refIdxClassMap["tile6"] ? refIdxClassMap["tile6"] : ""}`]}><span class=" text-gray-600 text-4xl font-bold">X</span></div>
                    <div bind:this={tile7} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center bg-[#eee4da]", {"opacity-0": refIdxClassMap["tile7"]}, `${refIdxClassMap["tile7"] ? refIdxClassMap["tile7"] : ""}`]}><span class=" text-gray-600 text-4xl font-bold">X</span></div>
        
                    <div bind:this={tile8} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center bg-[#eee4da]", {"opacity-0": refIdxClassMap["tile8"]}, `${refIdxClassMap["tile8"] ? refIdxClassMap["tile8"] : ""}`]}><span class=" text-gray-600 text-4xl font-bold">X</span></div>
                    <div bind:this={tile9} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center bg-[#eee4da]", {"opacity-0": refIdxClassMap["tile9"]}, `${refIdxClassMap["tile9"] ? refIdxClassMap["tile9"] : ""}`]}><span class=" text-gray-600 text-4xl font-bold">X</span></div>
                    <div bind:this={tile10} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center bg-[#eee4da]", {"opacity-0": refIdxClassMap["tile10"]}, `${refIdxClassMap["tile10"] ? refIdxClassMap["tile10"] : ""}`]}><span class=" text-gray-600 text-4xl font-bold">X</span></div>
                    <div bind:this={tile11} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center bg-[#eee4da]", {"opacity-0": refIdxClassMap["tile11"]}, `${refIdxClassMap["tile11"] ? refIdxClassMap["tile11"] : ""}`]}><span class=" text-gray-600 text-4xl font-bold">X</span></div>
        
                    <div bind:this={tile12} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center bg-[#eee4da]", {"opacity-0": refIdxClassMap["tile12"]}, `${refIdxClassMap["tile12"] ? refIdxClassMap["tile12"] : ""}`]}><span class=" text-gray-600 text-4xl font-bold">X</span></div>
                    <div bind:this={tile13} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center bg-[#eee4da]", {"opacity-0": refIdxClassMap["tile13"]}, `${refIdxClassMap["tile13"] ? refIdxClassMap["tile13"] : ""}`]}><span class=" text-gray-600 text-4xl font-bold">X</span></div>
                    <div bind:this={tile14} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center bg-[#eee4da]", {"opacity-0": refIdxClassMap["tile14"]}, `${refIdxClassMap["tile14"] ? refIdxClassMap["tile14"] : ""}`]}><span class=" text-gray-600 text-4xl font-bold">X</span></div>
                    <div bind:this={tile15} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center bg-[#eee4da]", {"opacity-0": refIdxClassMap["tile15"]}, `${refIdxClassMap["tile15"] ? refIdxClassMap["tile15"] : ""}`]}><span class=" text-gray-600 text-4xl font-bold">X</span></div> -->
                </div>

            </div>
        </div>
    </main>

    <footer class="flex justify-center">
        <div class="flex w-[450px]">
            <span class="tracking-wide">
                <span class="font-bold">HOW TO PLAY:</span> Use your <span class="font-bold">arrow keys</span>
                to move the tiles. Tiles with the same number <span class="font-bold">merge into one tile</span> when the touch.
                Add them up to reach <span class="font-bold">2048</span>!
            </span>
        </div>
    </footer>
</div>