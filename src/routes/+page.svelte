<script lang="ts">
	import Header from "$lib/components/Header.svelte";
    import { boardSlotIdxList, type BoardSlotIdx, type Coordinate, type GameState, type RefIndex, type SlideMap } from "$lib/types";
	import { createBoardSlotIdx, generateNewTileForGameState, getCoordsFromBoardSlotIdx, initNewGameState, spaceLeftOnBoard } from "$lib/utils/game";
	import { onMount } from "svelte";
    import gsap from "gsap";
	import { slideBoardUp, slideBoardDown, slideBoardRight, slideBoardLeft } from "$lib/utils/movement";

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
                    tl.to(
                        tile, {
                        x: xTrans,
                        y: yTrans,
                        duration: 0
                    });
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

        const tl = gsap.timeline();

        // Animation config!
        const SLIDE_ANIMATION_DURATION = 0.14;
        const SLIDE_ANIMATION_ANIMATION_EASE = "power2.inOut";
        const SCALE_ANIMATION_DURATION = 0.1;
        const SCALE_ANIMATION_ANIMATION_EASE = "power2.inOut";
        const SCALE = 1.11;

        const handleMove = (
            slideMap: SlideMap, 
            getNewCoordsFn: (currentCoords: [Coordinate, Coordinate], slideIdx: Coordinate) => BoardSlotIdx,
            getAnimationDirectionFn: (slideValue: number) => { [key: string]: string }
        ) => {
            const slideTweens: GSAPTween[] = [];
            // const mergeTweens:  GSAPTween[] = [];

            Object.entries(slideMap).forEach(([slotIdxToSlideFrom, slideVals]) => {

                const boardSlotIdx = slotIdxToSlideFrom as BoardSlotIdx;
                const boardSlot = gameState.board[boardSlotIdx];

                if (!boardSlot) return;

                // find tileRef
                const tileEl = tiles[boardSlot.refIndex];
                if (!tileEl) return;

                const currentCoords = getCoordsFromBoardSlotIdx(boardSlotIdx);
                const slideValue = slideVals?.slideValue! * 110;

                if (!slideValue) return;

                slideTweens.push(
                    gsap.to(tileEl, {
                        ...getAnimationDirectionFn(slideValue),
                        duration: SLIDE_ANIMATION_DURATION,
                        ease: SLIDE_ANIMATION_ANIMATION_EASE,
                        paused: true,
                    })
                );

                // Update state immediately (logic unchanged)
                const newCoords = getNewCoordsFn(
                    currentCoords as [Coordinate, Coordinate],
                    slideVals?.slideIdx as Coordinate
                );
                const existingTile = gameState.board[boardSlotIdx];

                if (slideVals?.merge) {
                    const updatedRef = existingTile!.refIndex;
                    const badRef = gameState.board[newCoords]?.refIndex;

                    gameState.board[newCoords] = {
                        refIndex: updatedRef,
                        value: slideVals?.mergeValue!,
                    };

                    // You can run merge animation separately (also parallel)
                    // mergeTweens.push(
                    //     gsap.to(tileEl, {
                    //         scale: SCALE,
                    //         duration: SCALE_ANIMATION_DURATION,
                    //         ease: SCALE_ANIMATION_ANIMATION_EASE,
                    //         paused: true,
                    //         onStart: () => {
                    //             if (badRef) {
                    //                 refIdxClassMap[badRef] = undefined;
                    //                 refIdxValueMap[badRef] = undefined;
                    //             }
                    //             refIdxClassMap[updatedRef] = "bg-red-500";
                    //             refIdxValueMap[updatedRef] = slideVals.mergeValue!;
                    //         },
                    //     })
                    // );

                    // mergeTweens.push(
                    //     gsap.to(tileEl, {
                    //         scale: 1,
                    //         duration: SCALE_ANIMATION_DURATION,
                    //         ease: SCALE_ANIMATION_ANIMATION_EASE,
                    //         paused: true,
                    //     })
                    // );
                } else {
                    gameState.board[newCoords] = existingTile;
                }

                gameState.board[boardSlotIdx] = undefined;
            });

            // Do animations all at one
            slideTweens.forEach((t) => t.play());
        
        };

        if (event.key === 'ArrowUp') {
            handleMove(
                slideBoardUp(boardSlotIdxList, $state.snapshot(gameState)),
                ([curX, _], slideIdx) => createBoardSlotIdx(curX, slideIdx),
                (slideValue) => ({ y: `-=${slideValue}` })
            );
        } else if (event.key === 'ArrowDown') {
            handleMove(
                slideBoardDown(boardSlotIdxList, $state.snapshot(gameState)),
                ([curX, _], slideIdx) => createBoardSlotIdx(curX, slideIdx),
                (slideValue) => ({ y: `+=${slideValue}` })
            );
        } else if (event.key === 'ArrowLeft') {
            handleMove(
                slideBoardLeft(boardSlotIdxList, $state.snapshot(gameState)),
                ([_, curY], slideIdx) => createBoardSlotIdx(slideIdx, curY),
                (slideValue) => ({ x: `-=${slideValue}` })
            );
        } else if (event.key === 'ArrowRight') {
            handleMove(
                slideBoardRight(boardSlotIdxList, $state.snapshot(gameState)),
                ([_, curY], slideIdx) => createBoardSlotIdx(slideIdx, curY),
                (slideValue) => ({ x: `+=${slideValue}` })
            );
        }

        // TODO: update score ...

        // Spawn in new tile
        if (spaceLeftOnBoard(gameState)) {
            const newTileVals = generateNewTileForGameState(gameState)

            console.log("new tile is: ", newTileVals)
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
        else {
            console.log("no space left...... END THE GAME!!!");
            // TODO: show game over modal, save best score, etc.
        }
        isMoving = false;
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
                    <div bind:this={tile0} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile0"]}, `${refIdxClassMap["tile0"] ? refIdxClassMap["tile0"] : ""}`]}><span class="text-tile-text">{refIdxValueMap["tile0"] ?? "noval"}</span></div>
                    <div bind:this={tile1} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile1"]}, `${refIdxClassMap["tile1"] ? refIdxClassMap["tile1"] : ""}`]}><span class="text-tile-text">{refIdxValueMap["tile1"] ?? "noval"}</span></div>
                    <div bind:this={tile2} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile2"]}, `${refIdxClassMap["tile2"] ? refIdxClassMap["tile2"] : ""}`]}><span class="text-tile-text">{refIdxValueMap["tile2"] ?? "noval"}</span></div>
                    <div bind:this={tile3} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile3"]}, `${refIdxClassMap["tile3"] ? refIdxClassMap["tile3"] : ""}`]}><span class="text-tile-text">{refIdxValueMap["tile3"] ?? "noval"}</span></div>
                    <div bind:this={tile4} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile4"]}, `${refIdxClassMap["tile4"] ? refIdxClassMap["tile4"] : ""}`]}><span class="text-tile-text">{refIdxValueMap["tile4"] ?? "noval"}</span></div>
                    <div bind:this={tile5} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile5"]}, `${refIdxClassMap["tile5"] ? refIdxClassMap["tile5"] : ""}`]}><span class="text-tile-text">{refIdxValueMap["tile5"] ?? "noval"}</span></div>
                    <div bind:this={tile6} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile6"]}, `${refIdxClassMap["tile6"] ? refIdxClassMap["tile6"] : ""}`]}><span class="text-tile-text">{refIdxValueMap["tile6"] ?? "noval"}</span></div>
                    <div bind:this={tile7} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile7"]}, `${refIdxClassMap["tile7"] ? refIdxClassMap["tile7"] : ""}`]}><span class="text-tile-text">{refIdxValueMap["tile7"] ?? "noval"}</span></div>
                    <div bind:this={tile8} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile8"]}, `${refIdxClassMap["tile8"] ? refIdxClassMap["tile8"] : ""}`]}><span class="text-tile-text">{refIdxValueMap["tile8"] ?? "noval"}</span></div>
                    <div bind:this={tile9} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile9"]}, `${refIdxClassMap["tile9"] ? refIdxClassMap["tile9"] : ""}`]}><span class="text-tile-text">{refIdxValueMap["tile9"] ?? "noval"}</span></div>
                    <div bind:this={tile10} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile10"]}, `${refIdxClassMap["tile10"] ? refIdxClassMap["tile10"] : ""}`]}><span class="text-tile-text">{refIdxValueMap["tile10"] ?? "noval"}</span></div>
                    <div bind:this={tile11} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile11"]}, `${refIdxClassMap["tile11"] ? refIdxClassMap["tile11"] : ""}`]}><span class="text-tile-text">{refIdxValueMap["tile11"] ?? "noval"}</span></div>
                    <div bind:this={tile12} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile12"]}, `${refIdxClassMap["tile12"] ? refIdxClassMap["tile12"] : ""}`]}><span class="text-tile-text">{refIdxValueMap["tile12"] ?? "noval"}</span></div>
                    <div bind:this={tile13} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile13"]}, `${refIdxClassMap["tile13"] ? refIdxClassMap["tile13"] : ""}`]}><span class="text-tile-text">{refIdxValueMap["tile13"] ?? "noval"}</span></div>
                    <div bind:this={tile14} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile14"]}, `${refIdxClassMap["tile14"] ? refIdxClassMap["tile14"] : ""}`]}><span class="text-tile-text">{refIdxValueMap["tile14"] ?? "noval"}</span></div>
                    <div bind:this={tile15} class={["absolute rounded-xl h-[100px] w-[100px] flex items-center justify-center", {"opacity-0": !refIdxClassMap["tile15"]}, `${refIdxClassMap["tile15"] ? refIdxClassMap["tile15"] : ""}`]}><span class="text-tile-text">{refIdxValueMap["tile15"] ?? "noval"}</span></div>
                </div>
            </div>
        </div>
    </main>

    <footer class="flex justify-center">
        <div class="flex w-[450px]">
            <span class="px-1">
                <span class="font-extrabold text-lg underline underline-offset-3 decoration-2">HOW TO PLAY:</span> Use your <span class="font-bold">arrow keys</span>
                to move the tiles. Tiles with the <span class="font-bold">same number merge into one</span> tile when they touch.
                Add them up to reach <span class="font-bold">2048</span>!
            </span>
        </div>
    </footer>
</div>