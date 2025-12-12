<script lang="ts">
	import Header from "$lib/components/Header.svelte";
    import { boardSlotIdxList, type BoardSlotIdx, type Coordinate, type GameState, type MergeMap, type RefIndex, type SlideMap } from "$lib/types";
	import {  generateNewTileForGameState, getCoordsFromBoardSlotIdx, initNewGameState, spaceLeftOnBoard } from "$lib/utils/game";
	import { onMount } from "svelte";
    import gsap from "gsap";
	import { slideBoard } from "$lib/utils/movement";
	import { getTileColorClass } from "$lib/utils/ui";

    //  16 playable tiles to move and animate around
    let tile0: HTMLDivElement; let tile1: HTMLDivElement; let tile2: HTMLDivElement; let tile3: HTMLDivElement;
    let tile4: HTMLDivElement;let tile5: HTMLDivElement; let tile6: HTMLDivElement; let tile7: HTMLDivElement;
    let tile8: HTMLDivElement; let tile9: HTMLDivElement; let tile10: HTMLDivElement; let tile11: HTMLDivElement;
    let tile12: HTMLDivElement; let tile13: HTMLDivElement; let tile14: HTMLDivElement; let tile15: HTMLDivElement;

    // Maps refIdx to class .. TODO: USE THIS TO COLOR TILES!!! i think 
    const initRefIdxMap = {
        tile0: undefined, tile1: undefined, tile2: undefined, tile3: undefined,
        tile4: undefined, tile5: undefined, tile6: undefined, tile7: undefined,
        tile8: undefined, tile9: undefined, tile10: undefined, tile11: undefined,
        tile12: undefined, tile13: undefined, tile14: undefined, tile15: undefined  
    }
    let refIdxClassMap = $state<Record<RefIndex, string | undefined>>(initRefIdxMap);
    let refIdxValueMap = $state<Record<RefIndex, number | undefined>>(initRefIdxMap);

    // MAIN GAME STATE
    let gameState = $state<GameState>(initNewGameState());

    // Helper Fns
    function initNewGameUI(newGamePressed?: boolean) {
        const tiles = {
            tile0,
            tile1
        };
        refIdxClassMap = initRefIdxMap;
        refIdxValueMap = initRefIdxMap
        ;
        Object.entries(tiles).forEach(([tileRefIdx, tile]) => {
            Object.entries(gameState.board).forEach(([boardSlotIdx, boardSlot]) => {

                // If Tile in boardSlot, and refIndex matches
                if (boardSlot?.refIndex === tileRefIdx){
                    const [curX, curY] = getCoordsFromBoardSlotIdx(boardSlotIdx as BoardSlotIdx);
                    const xTrans = curX * 110;
                    const yTrans = curY * 110;

                    refIdxClassMap[tileRefIdx] =  `${boardSlot.value === 4 ? "bg-tile-4" : "bg-tile-2"}`
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

                    // TODO: put this to a function ... 
                    tl.to( tile, { x: xTrans,  y: yTrans, duration: 0 });
                    tl.to(tile, {
                        delay: newGamePressed ? 0 : 0.15,
                        scale: 1.1,
                        duration: 0.07,
                        ease: "power4.out"
                    });
                    tl.to(tile, {
                        delay: newGamePressed ? 0 : 0.075,
                        scale: 1,
                        duration: 0.07,
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
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        if (isMoving) return;

        isMoving = true;

        const tiles = {
            tile0, tile1, tile2, tile3, tile4, tile5, tile6, tile7,
            tile8, tile9, tile10, tile11, tile12, tile13, tile14,tile15,
        };

        // Animation config!
        const SLIDE_ANIMATION_DURATION = 0.14;
        const SLIDE_ANIMATION_ANIMATION_EASE = "power2.inOut";
        const SCALE_ANIMATION_DURATION = 0.1;
        const SCALE_ANIMATION_ANIMATION_EASE = "power2.inOut";
        const SCALE = 1.2;

        let aTileMoved = false;
        const handleMove = (
            slideMap: SlideMap, 
            mergeMap: MergeMap,
            newGameState: GameState,
            getAnimationDirection: (slideValue: number) => { [key: string]: string }
        ) => {
            const slideTweens: GSAPTween[] = [];
            const mergeTweens: GSAPTween[] = [];
            console.log("INITIAL GAME STATE: ", gameState)

            // Create slide animations
            Object.entries(slideMap).forEach(([slotIdxToSlideFrom, slideVals]) => {
                const boardSlotIdx = slotIdxToSlideFrom as BoardSlotIdx;
                const boardSlot = gameState.board[boardSlotIdx];
                if (!boardSlot) return;
                // Find tileRef
                const tileEl = tiles[boardSlot.refIndex];
                if (!tileEl) return;


                // TODO: this could be a bad line
                const slideValue = slideVals?.slideValue! * 110;
                if (!slideValue) return;
                if (slideValue > 0) aTileMoved = true;

                // Push slide animation
                slideTweens.push(
                    gsap.to(tileEl, {
                        ...getAnimationDirection(slideValue),
                        duration: SLIDE_ANIMATION_DURATION,
                        ease: SLIDE_ANIMATION_ANIMATION_EASE,
                        paused: true,
                    })
                );
            });

            // Merge animations
            Object.entries(mergeMap).forEach(([slotIdxToSlideFrom, mergeVals]) => {
                const boardSlotIdx = slotIdxToSlideFrom as BoardSlotIdx;
                const boardSlot = gameState.board[boardSlotIdx];
                if (boardSlot === undefined) return;
                const tileEl = tiles[boardSlot.refIndex];

                const mergeValue = mergeVals?.mergeValue
                const mergeRefIndex = mergeVals?.refIndex
                if (!mergeRefIndex) return;
                if (typeof mergeValue !== "number") return;

                if (mergeValue === -1) {
                    mergeTweens.push(
                        gsap.to(tileEl, {
                            scale: 0,
                            duration: SCALE_ANIMATION_DURATION,
                            delay: SLIDE_ANIMATION_DURATION,
                            ease: SCALE_ANIMATION_ANIMATION_EASE,
                            paused: true,
                            onComplete: () => {
                                // Free up the div elt to be used
                                refIdxClassMap[mergeRefIndex] = undefined;
                                refIdxValueMap[mergeRefIndex] = undefined;
                                // mergeTweens.push( gsap.to(tileEl, { x: 0, y: 0, duration: 0 }) ); // Reset back to 0,0
                                mergeTweens.push(gsap.set(tileEl, {clearProps: "x,y"}));
                            }
                        })
                    );

                } else if (mergeValue > 0) {
                    mergeTweens.push(
                        gsap.to(tileEl, {
                            scale: SCALE,
                                duration: 0.05,
                                ease: SCALE_ANIMATION_ANIMATION_EASE,
                                delay: SLIDE_ANIMATION_DURATION,
                                paused: true,
                        })
                    );
                    mergeTweens.push(
                        gsap.to(tileEl, {
                            scale: 1,
                                duration: 0.19,
                                ease: SCALE_ANIMATION_ANIMATION_EASE,
                                paused: true,
                        })
                    );

                    // Update Tile's value and color
                    refIdxClassMap[mergeRefIndex] = getTileColorClass(mergeValue);
                    refIdxValueMap[mergeRefIndex] = mergeValue;
                }
            });

            // Do animations all at once
            slideTweens.forEach((t) => t.play());
            mergeTweens.forEach((t) => t.play());

            // Update state
            gameState = newGameState;
        };
        // -------------- //

        if (event.key === 'ArrowUp') {
            const [slideMap, mergeMap, newGameState] = slideBoard("up", boardSlotIdxList, $state.snapshot(gameState));
            handleMove(
                slideMap as SlideMap,
                mergeMap as MergeMap,
                newGameState as GameState,
                (slideValue) => ({ y: `-=${slideValue}` })
            );
        }
        else if (event.key === 'ArrowDown') {
            const [slideMap, mergeMap, newGameState] = slideBoard("down", boardSlotIdxList, $state.snapshot(gameState));
            handleMove(
                slideMap as SlideMap,
                mergeMap as MergeMap,
                newGameState as GameState,
                (slideValue) => ({ y: `+=${slideValue}` })
            );
        }
        else if (event.key === 'ArrowLeft') {
            const [slideMap, mergeMap, newGameState] = slideBoard("left", boardSlotIdxList, $state.snapshot(gameState));
            console.log("calling handleMove for Left!!");
            handleMove(
                slideMap as SlideMap,
                mergeMap as MergeMap,
                newGameState as GameState,
                (slideValue) => ({ x: `-=${slideValue}` })
            );
        }
        else if (event.key === 'ArrowRight') {
            const [slideMap, mergeMap, newGameState] = slideBoard("right", boardSlotIdxList, $state.snapshot(gameState));
            console.log("calling handleMove for Right!!");
            handleMove(
                slideMap as SlideMap,
                mergeMap as MergeMap,
                newGameState as GameState,
                (slideValue) => ({ x: `+=${slideValue}` })
            );
        }
    
        // TODO: update score ...


        // Spawn in new tile
        // TODO: this needs to check if valid move instead** ... aka there might be no space left, but you can still slide .... 
        
        if (aTileMoved) {
            const newTileVals = generateNewTileForGameState(gameState)

            for (const [tileRefIdx, tileClass] of Object.entries(refIdxClassMap)) {

                // Find first unused divElt
                if (tileClass === undefined) {
                    const unusedRefIndex = tileRefIdx as RefIndex;
                    const value = newTileVals?.value;

                    // Set Tile in gameState
                    gameState.board[newTileVals?.boardSlotIdx as BoardSlotIdx] = { refIndex: unusedRefIndex, value: value as number }

                    // Style
                    refIdxClassMap[unusedRefIndex] = `${value === 4 ? "bg-tile-4" : "bg-tile-2"}`
                    refIdxValueMap[unusedRefIndex] = newTileVals?.value;

                     // Animate into position
                    const [curX, curY] = getCoordsFromBoardSlotIdx(newTileVals?.boardSlotIdx as BoardSlotIdx);
                    const xTrans = curX * 110;
                    const yTrans = curY * 110;
                    const tileToAnimate = tiles[unusedRefIndex]
                    const tl = gsap.timeline();
                    tl.to(
                        tileToAnimate, {
                        x: xTrans,
                        y: yTrans,
                        duration: 0
                    });
                    tl.fromTo(tileToAnimate, {
                        scale: 0
                    },
                    {
                        scale: SCALE,
                        duration: 0.2,
                        ease: SCALE_ANIMATION_ANIMATION_EASE
                    });
                    tl.to(tileToAnimate, {
                        scale: 1,
                        duration: 0.1,
                        ease: SCALE_ANIMATION_ANIMATION_EASE
                    })
                    break;
                }
            }
        }
        isMoving = false;
        console.log("New gameState is: ", gameState)
        console.log("refIdxClassMap is: ", refIdxClassMap)
        console.log("refIdxValueMap is: ", refIdxValueMap)


        if (spaceLeftOnBoard(gameState)){
            console.log("TODO: check if game over or not ...")
        }
    }
</script>

<svelte:head><title>2048</title></svelte:head>
<svelte:window on:keydown={handleKeydown} />

<!-- 2048 -->
<div> 
    <Header score={gameState.score} best={-1} onStartNewGameClick={startNewGame}/>

    <!-- 450px is the width of the board -->
    <main class="flex justify-center p-4 my-1.5 ">
        <div id="game-board" class="grid grid-cols-4 gap-2.5 rounded-xl bg-board p-2.5 relative">
            {#each Array(16)}
                <div class="rounded-xl bg-tile-empty h-[100px] w-[100px] shadow-sm"></div>
            {/each}

            <div id="tiles" class="absolute top-0 left-0 p-2.5 h-[450px] w-[450px]">
                <div class="relative text-[45px] font-bold">
                    <div bind:this={tile0} id="tile0" class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile0"]}, `${refIdxClassMap["tile0"] ? refIdxClassMap["tile0"] : ""}`]}><span>{refIdxValueMap["tile0"] ?? "noval"}</span></div>
                    <div bind:this={tile1} id="tile1" class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile1"]}, `${refIdxClassMap["tile1"] ? refIdxClassMap["tile1"] : ""}`]}><span>{refIdxValueMap["tile1"] ?? "noval"}</span></div>
                    <div bind:this={tile2} id="tile2" class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile2"]}, `${refIdxClassMap["tile2"] ? refIdxClassMap["tile2"] : ""}`]}><span>{refIdxValueMap["tile2"] ?? "noval"}</span></div>
                    <div bind:this={tile3} id="tile3" class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile3"]}, `${refIdxClassMap["tile3"] ? refIdxClassMap["tile3"] : ""}`]}><span>{refIdxValueMap["tile3"] ?? "noval"}</span></div>
                    <div bind:this={tile4} id="tile4" class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile4"]}, `${refIdxClassMap["tile4"] ? refIdxClassMap["tile4"] : ""}`]}><span>{refIdxValueMap["tile4"] ?? "noval"}</span></div>
                    <div bind:this={tile5} id="tile5" class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile5"]}, `${refIdxClassMap["tile5"] ? refIdxClassMap["tile5"] : ""}`]}><span>{refIdxValueMap["tile5"] ?? "noval"}</span></div>
                    <div bind:this={tile6} id="tile6" class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile6"]}, `${refIdxClassMap["tile6"] ? refIdxClassMap["tile6"] : ""}`]}><span>{refIdxValueMap["tile6"] ?? "noval"}</span></div>
                    <div bind:this={tile7} id="tile7" class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile7"]}, `${refIdxClassMap["tile7"] ? refIdxClassMap["tile7"] : ""}`]}><span>{refIdxValueMap["tile7"] ?? "noval"}</span></div>
                    <div bind:this={tile8} id="tile8" class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile8"]}, `${refIdxClassMap["tile8"] ? refIdxClassMap["tile8"] : ""}`]}><span>{refIdxValueMap["tile8"] ?? "noval"}</span></div>
                    <div bind:this={tile9} id="tile9" class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile9"]}, `${refIdxClassMap["tile9"] ? refIdxClassMap["tile9"] : ""}`]}><span>{refIdxValueMap["tile9"] ?? "noval"}</span></div>
                    <div bind:this={tile10} id="tile10" class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile10"]}, `${refIdxClassMap["tile10"] ? refIdxClassMap["tile10"] : ""}`]}><span>{refIdxValueMap["tile10"] ?? "noval"}</span></div>
                    <div bind:this={tile11} id="tile11" class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile11"]}, `${refIdxClassMap["tile11"] ? refIdxClassMap["tile11"] : ""}`]}><span>{refIdxValueMap["tile11"] ?? "noval"}</span></div>
                    <div bind:this={tile12} id="tile12" class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile12"]}, `${refIdxClassMap["tile12"] ? refIdxClassMap["tile12"] : ""}`]}><span>{refIdxValueMap["tile12"] ?? "noval"}</span></div>
                    <div bind:this={tile13} id="tile13" class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile13"]}, `${refIdxClassMap["tile13"] ? refIdxClassMap["tile13"] : ""}`]}><span>{refIdxValueMap["tile13"] ?? "noval"}</span></div>
                    <div bind:this={tile14} id="tile14" class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile14"]}, `${refIdxClassMap["tile14"] ? refIdxClassMap["tile14"] : ""}`]}><span>{refIdxValueMap["tile14"] ?? "noval"}</span></div>
                    <div bind:this={tile15} id="tile15" class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile15"]}, `${refIdxClassMap["tile15"] ? refIdxClassMap["tile15"] : ""}`]}><span>{refIdxValueMap["tile15"] ?? "noval"}</span></div>
                </div>
            </div>
        </div>
    </main>

    <footer class="flex justify-center">
        <div class="flex w-[450px]">
            <span class="px-1">
                <span class="font-extrabold text-lg underline underline-offset-3 decoration-2 leading-tight">HOW TO PLAY:</span> Use your <span class="font-bold">arrow keys</span>
                to move the tiles. Tiles with the <span class="font-bold">same number merge into one</span> tile when they touch.
                Add them up to reach <span class="font-bold">2048</span>!
            </span>
        </div>
    </footer>
</div>