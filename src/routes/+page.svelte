<script lang="ts">
	import Header from "$lib/components/Header.svelte";
    import { boardSlotIdxList, type BestIndex, type BoardSlotIdx, type GameState, type MergeMap, type RefIndex, type ScoreIndex, type SlideMap } from "$lib/types";
	import {  canSlideTile, generateNewTileForGameState, getCoordsFromBoardSlotIdx, initNewGameState, spaceLeftOnBoard } from "$lib/utils/game";
	import { onMount } from "svelte";
    import gsap from "gsap";
	import { slideBoard } from "$lib/utils/movement";
	import { getTileColorClass } from "$lib/utils/ui";
	import { NEW_GAME_DELAY, SCALE, SCALE_ANIMATION_ANIMATION_EASE, SCALE_ANIMATION_DURATION_DOWN, SCALE_ANIMATION_DURATION_KILL, SCALE_ANIMATION_DURATION_UP, SCORE_XY_EASE, SCORE_OPACITY_EASE, SCORE_ANIMATION_DURATION, SCORE_XY_TRANS, SLIDE_ANIMATION_ANIMATION_EASE, SLIDE_ANIMATION_DURATION, SPAWN_DELAY, TILE_COLOR_MAP, TRANSLATION_WIDTH, TURN_LOCK_TIME } from "$lib/consts";
	import { openGameOverDialog } from "$lib/components/GameOverDialog.svelte";
	import GameOverDialog from "$lib/components/GameOverDialog.svelte";

    //  16 playable tiles to move and animate around
    let tile0: HTMLDivElement; let tile1: HTMLDivElement; let tile2: HTMLDivElement; let tile3: HTMLDivElement;
    let tile4: HTMLDivElement;let tile5: HTMLDivElement; let tile6: HTMLDivElement; let tile7: HTMLDivElement;
    let tile8: HTMLDivElement; let tile9: HTMLDivElement; let tile10: HTMLDivElement; let tile11: HTMLDivElement;
    let tile12: HTMLDivElement; let tile13: HTMLDivElement; let tile14: HTMLDivElement; let tile15: HTMLDivElement;
    const initRefIdxMap = {
        tile0: undefined, tile1: undefined, tile2: undefined, tile3: undefined,
        tile4: undefined, tile5: undefined, tile6: undefined, tile7: undefined,
        tile8: undefined, tile9: undefined, tile10: undefined, tile11: undefined,
        tile12: undefined, tile13: undefined, tile14: undefined, tile15: undefined  
    }
    // Maps for Divs for UI vals/styling
    let refIdxClassMap = $state<Record<RefIndex, string | undefined>>(initRefIdxMap);
    let refIdxValueMap = $state<Record<RefIndex, number | undefined>>(initRefIdxMap);

    // For score
    let score0 =  $state<HTMLSpanElement | undefined>(undefined); let score1 =  $state<HTMLSpanElement | undefined>(undefined);
    let score2 =  $state<HTMLSpanElement | undefined>(undefined); let score3 =  $state<HTMLSpanElement | undefined>(undefined);
    let score4 =  $state<HTMLSpanElement | undefined>(undefined); let score5 =  $state<HTMLSpanElement | undefined>(undefined);
    let scoreIdxValueMap = $state<Record<ScoreIndex, number | undefined>>(
        { score0: undefined, score1: undefined, score2: undefined, score3: undefined, score4: undefined, score5: undefined }
    );
    let scoreIdxClassMap = $state<Record<ScoreIndex, string | undefined>>(
        { score0: undefined, score1: undefined, score2: undefined, score3: undefined, score4: undefined, score5: undefined }
    );

    let best0 =  $state<HTMLSpanElement | undefined>(undefined); let best1 =  $state<HTMLSpanElement | undefined>(undefined);
    let best2 =  $state<HTMLSpanElement | undefined>(undefined); let best3 =  $state<HTMLSpanElement | undefined>(undefined);
    let best4 =  $state<HTMLSpanElement | undefined>(undefined); let best5 =  $state<HTMLSpanElement | undefined>(undefined);
    let bestIdxValueMap = $state<Record<BestIndex, number | undefined>>(
        { best0: undefined, best1: undefined, best2: undefined, best3: undefined, best4: undefined, best5: undefined }
    );
    let bestIdxClassMap = $state<Record<BestIndex, string | undefined>>(
        { best0: undefined, best1: undefined, best2: undefined, best3: undefined, best4: undefined, best5: undefined }
    );





    // MAIN GAME STATE
    let gameState = $state<GameState>(initNewGameState());

    // Helper Fns
    function initNewGameUI(newGamePressed?: boolean) {
        const tiles = { tile0, tile1 };
        refIdxClassMap = initRefIdxMap;
        refIdxValueMap = initRefIdxMap;
        Object.entries(tiles).forEach(([tileRefIdx, tile]) => {
            Object.entries(gameState.board).forEach(([boardSlotIdx, boardSlot]) => {

                // Find referenced tile (div)
                if (boardSlot?.refIndex === tileRefIdx){
                    const [curX, curY] = getCoordsFromBoardSlotIdx(boardSlotIdx as BoardSlotIdx);
                    const xTrans = curX * TRANSLATION_WIDTH;
                    const yTrans = curY * TRANSLATION_WIDTH;

                    refIdxClassMap[tileRefIdx] =  `${boardSlot.value === 4 ? TILE_COLOR_MAP[4] : TILE_COLOR_MAP[2]}`
                    refIdxValueMap[tileRefIdx] = gameState.board[boardSlotIdx as BoardSlotIdx]?.value

                    const tl = gsap.timeline();
                    if (newGamePressed) {
                        tl.to(tile, {
                            scale: 0,
                            duration: SCALE_ANIMATION_DURATION_KILL,
                            ease: SCALE_ANIMATION_ANIMATION_EASE
                        });
                    } else { tl.to(tile, { scale: 0, duration: 0  }); }

                    // Move to place and POP in 
                    tl.to( tile, { x: xTrans,  y: yTrans, duration: 0 });
                    tl.to(tile, {
                        delay: newGamePressed ? 0 : NEW_GAME_DELAY,
                        scale: SCALE,
                        duration: SCALE_ANIMATION_DURATION_UP,
                        ease: SCALE_ANIMATION_ANIMATION_EASE
                    });
                    tl.to(tile, {
                        scale: 1,
                        duration: SCALE_ANIMATION_DURATION_DOWN,
                        ease: SCALE_ANIMATION_ANIMATION_EASE
                    });
                }
            })
        });
    }

    onMount(() => {
        initNewGameUI();
    });

    function startNewGame() {
        gameState = initNewGameState(gameState.best);
        initNewGameUI(true);
    }

    let gameOverDialogIsOpen = $state(false);
    let isMoving = $state(false);

    function handleKeydown(event: KeyboardEvent) {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        if (isMoving) return;
        if (gameOverDialogIsOpen) return;

        isMoving = true;

        setTimeout(() => {
            isMoving = false;
        }, TURN_LOCK_TIME * 1000);

        const tiles = { tile0, tile1, tile2, tile3, tile4, tile5, tile6, tile7, tile8, tile9, tile10, tile11, tile12, tile13, tile14,tile15 };
        const scores = { score0, score1, score2, score3, score4, score5 };
        const bests = { best0, best1, best2, best3, best4, best5 };

        let aTileMoved = false;
        const handleMove = (
            slideMap: SlideMap, 
            mergeMap: MergeMap,
            newGameState: GameState,
            getAnimationDirection: (slideValue: number) => { [key: string]: string }
        ) => {
            const slideTweens: GSAPTween[] = [];
            const mergeTweens: GSAPTween[] = [];

            // Create slide animations
            Object.entries(slideMap).forEach(([slotIdxToSlideFrom, slideVals]) => {
                const boardSlotIdx = slotIdxToSlideFrom as BoardSlotIdx;
                const boardSlot = gameState.board[boardSlotIdx];
                if (!boardSlot) return;
                const tileEl = tiles[boardSlot.refIndex];
                if (!tileEl) return;

                const slideValue = slideVals?.slideValue! * TRANSLATION_WIDTH;
                if (!slideValue) return;
                if (slideValue > 0) aTileMoved = true;

                // Push slide animations
                const mergeVal = mergeMap[slotIdxToSlideFrom as BoardSlotIdx]?.mergeValue
                if (mergeVal === -1) return;
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
            let totalMergeValue = 0;
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
                            duration: SCALE_ANIMATION_DURATION_DOWN,
                            delay: SLIDE_ANIMATION_DURATION,
                            ease: SCALE_ANIMATION_ANIMATION_EASE,
                            paused: true,
                            onComplete: () => {
                                // Free up the div elt to be used
                                refIdxClassMap[mergeRefIndex] = undefined;
                                refIdxValueMap[mergeRefIndex] = undefined;
                                mergeTweens.push(gsap.set(tileEl, {clearProps: "x,y"}));
                            }
                        })
                    );
                } else if (mergeValue > 0) {
                    mergeTweens.push(
                        gsap.to(tileEl, {
                            scale: SCALE,
                            duration: SCALE_ANIMATION_DURATION_UP,
                            ease: SCALE_ANIMATION_ANIMATION_EASE,
                            delay: SLIDE_ANIMATION_DURATION,
                            paused: true,
                            onComplete: () => {
                                gsap.to(tileEl, {
                                    scale: 1,
                                    duration: SCALE_ANIMATION_DURATION_DOWN,
                                    ease: SCALE_ANIMATION_ANIMATION_EASE,
                                })
                            }
                        })
                    );

                    // Update Tile's value and color
                    refIdxClassMap[mergeRefIndex] = getTileColorClass(mergeValue);
                    refIdxValueMap[mergeRefIndex] = mergeValue;

                    totalMergeValue += mergeValue;
                    // Animate score
                }
            });


            // Score animation
            for (const [scoreIndex, scoreClass] of Object.entries(scoreIdxClassMap)) {
                if (scoreClass === undefined && totalMergeValue !== 0) {
                    const unusedScoreIndex = scoreIndex as ScoreIndex;
    
                    // Style
                    scoreIdxClassMap[unusedScoreIndex] = "show"
                    scoreIdxValueMap[unusedScoreIndex] = totalMergeValue;

                    const scoreToAnimate = scores[unusedScoreIndex];

                    // Score
                    mergeTweens.push(
                        gsap.fromTo(scoreToAnimate!, { x: 0, y: 0 }, {
                            ...SCORE_XY_TRANS,
                            duration: SCORE_ANIMATION_DURATION,
                            ease: SCORE_XY_EASE,
                            paused: true,
                            onComplete: () => {
                                gsap.to(scoreToAnimate!, { y: 0, x: 0, duration: 0})
                                mergeTweens.push(gsap.set(scoreToAnimate!, {clearProps: "x,y"}));
                            }
                        })
                    );
                    mergeTweens.push(
                        gsap.fromTo(scoreToAnimate!,
                        { opacity: 1 },
                        {
                            opacity: 0,
                            duration: SCORE_ANIMATION_DURATION,
                            ease: SCORE_OPACITY_EASE,
                            paused: true,
                            onComplete: () => {
                                scoreIdxClassMap[unusedScoreIndex] = undefined;
                                scoreIdxValueMap[unusedScoreIndex] = undefined;
                                mergeTweens.push(gsap.set(scoreToAnimate!, {clearProps: "opacity"}));
                            }
                        })
                    );

                    // Best Score
                    if (gameState.score + totalMergeValue > gameState.best) {
                        console.log("FOUND A NEW BEST!!")
                        for (const [bestIndex, bestClass] of Object.entries(bestIdxClassMap)) {
                            if (bestClass === undefined ) {
                                const unusedBestIndex = bestIndex as BestIndex;

                                bestIdxClassMap[unusedBestIndex] = "show"
                                bestIdxValueMap[unusedBestIndex] = totalMergeValue;

                                const bestToAnimate = bests[unusedBestIndex];

                                mergeTweens.push(
                                    gsap.fromTo(bestToAnimate!, { x: 0, y: 0 }, {
                                        ...SCORE_XY_TRANS,
                                        duration: SCORE_ANIMATION_DURATION,
                                        ease: SCORE_XY_EASE,
                                        paused: true,
                                        onComplete: () => {
                                            gsap.to(bestToAnimate!, { y: 0, x: 0, duration: 0})
                                            mergeTweens.push(gsap.set(bestToAnimate!, {clearProps: "x,y"}));
                                        }
                                    })
                                );
                                mergeTweens.push(
                                    gsap.fromTo(bestToAnimate!,
                                    { opacity: 1 },
                                    {
                                        opacity: 0,
                                        duration: SCORE_ANIMATION_DURATION,
                                        ease: SCORE_OPACITY_EASE,
                                        paused: true,
                                        onComplete: () => {
                                            bestIdxClassMap[unusedBestIndex] = undefined;
                                            bestIdxValueMap[unusedBestIndex] = undefined;
                                            mergeTweens.push(gsap.set(bestToAnimate!, {clearProps: "opacity"}));
                                        }
                                    })
                                );
                                break;
                            }
                        }
                    }
                    break;
                }
            };

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
            handleMove(
                slideMap as SlideMap,
                mergeMap as MergeMap,
                newGameState as GameState,
                (slideValue) => ({ x: `-=${slideValue}` })
            );
        }
        else if (event.key === 'ArrowRight') {
            const [slideMap, mergeMap, newGameState] = slideBoard("right", boardSlotIdxList, $state.snapshot(gameState));
            handleMove(
                slideMap as SlideMap,
                mergeMap as MergeMap,
                newGameState as GameState,
                (slideValue) => ({ x: `+=${slideValue}` })
            );
        }
            
         // Spawn in new tile
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
                    refIdxClassMap[unusedRefIndex] = `${value === 4 ? TILE_COLOR_MAP[4] : TILE_COLOR_MAP[2]}`
                    refIdxValueMap[unusedRefIndex] = newTileVals?.value;

                     // Animate into position
                    const [curX, curY] = getCoordsFromBoardSlotIdx(newTileVals?.boardSlotIdx as BoardSlotIdx);
                    const xTrans = curX * TRANSLATION_WIDTH;
                    const yTrans = curY * TRANSLATION_WIDTH;
                    const tileToAnimate = tiles[unusedRefIndex]

                    const tl = gsap.timeline();
                    tl.to( tileToAnimate, {
                        x: xTrans,
                        y: yTrans,
                        duration: 0,
                        delay: SPAWN_DELAY
                    });
                    tl.fromTo(tileToAnimate, { scale: 0},
                    {
                        scale: SCALE,
                        duration: SCALE_ANIMATION_DURATION_UP,
                        ease: SCALE_ANIMATION_ANIMATION_EASE
                    });
                    tl.to(tileToAnimate, {
                        scale: 1,
                        duration: SCALE_ANIMATION_DURATION_DOWN,
                        ease: SCALE_ANIMATION_ANIMATION_EASE
                    })
                    break;
                }
            }
        }

        if (!spaceLeftOnBoard(gameState)){
            if (!(canSlideTile(gameState))) {
                gameOverDialogIsOpen = true;
                openGameOverDialog();
            }
        }
    }
</script>

<svelte:head><title>2048</title></svelte:head>
<svelte:window on:keydown={handleKeydown} />

<!-- 2048 -->
<div> 
    <Header
        score={gameState.score} best={gameState.best} onStartNewGameClick={startNewGame}
        bind:score0={score0!} bind:score1={score1!} bind:score2={score2!} bind:score3={score3!} bind:score4={score4!} bind:score5={score5!}
        {scoreIdxValueMap} {scoreIdxClassMap}
        bind:best0={best0!} bind:best1={best1!} bind:best2={best2!} bind:best3={best3!} bind:best4={best4!} bind:best5={best5!}
        {bestIdxValueMap} {bestIdxClassMap}
    />

    <!-- 450px is the width of the board -->
    <main class="flex justify-center p-4 my-1.5 ">
        <div id="game-board" class="grid grid-cols-4 gap-2.5 rounded-xl bg-board p-2.5 relative shadow-sm">
            {#each Array(16)}
                <div class="rounded-xl bg-tile-empty h-[100px] w-[100px] shadow-sm"></div>
            {/each}

            <div id="tiles" class="absolute top-0 left-0 p-2.5 h-[450px] w-[450px]">
                <div class="relative text-[45px] font-bold">
                    <div bind:this={tile0} id="tile0"class={["animated-tile",{"opacity-0": !refIdxClassMap["tile0"]},`${refIdxClassMap["tile0"] ? refIdxClassMap["tile0"] : ""}`]}><span>{refIdxValueMap["tile0"] ?? "noval"}</span></div>
                    <div bind:this={tile1} id="tile1"class={["animated-tile",{"opacity-0": !refIdxClassMap["tile1"]},`${refIdxClassMap["tile1"] ? refIdxClassMap["tile1"] : ""}`]}><span>{refIdxValueMap["tile1"] ?? "noval"}</span></div>
                    <div bind:this={tile2} id="tile2"class={["animated-tile",{"opacity-0": !refIdxClassMap["tile2"]},`${refIdxClassMap["tile2"] ? refIdxClassMap["tile2"] : ""}`]}><span>{refIdxValueMap["tile2"] ?? "noval"}</span></div>
                    <div bind:this={tile3} id="tile3"class={["animated-tile",{"opacity-0": !refIdxClassMap["tile3"]},`${refIdxClassMap["tile3"] ? refIdxClassMap["tile3"] : ""}`]}><span>{refIdxValueMap["tile3"] ?? "noval"}</span></div>
                    <div bind:this={tile4} id="tile4"class={["animated-tile",{"opacity-0": !refIdxClassMap["tile4"]},`${refIdxClassMap["tile4"] ? refIdxClassMap["tile4"] : ""}`]}><span>{refIdxValueMap["tile4"] ?? "noval"}</span></div>
                    <div bind:this={tile5} id="tile5"class={["animated-tile",{"opacity-0": !refIdxClassMap["tile5"]},`${refIdxClassMap["tile5"] ? refIdxClassMap["tile5"] : ""}`]}><span>{refIdxValueMap["tile5"] ?? "noval"}</span></div>
                    <div bind:this={tile6} id="tile6"class={["animated-tile",{"opacity-0": !refIdxClassMap["tile6"]},`${refIdxClassMap["tile6"] ? refIdxClassMap["tile6"] : ""}`]}><span>{refIdxValueMap["tile6"] ?? "noval"}</span></div>
                    <div bind:this={tile7} id="tile7"class={["animated-tile",{"opacity-0": !refIdxClassMap["tile7"]},`${refIdxClassMap["tile7"] ? refIdxClassMap["tile7"] : ""}`]}><span>{refIdxValueMap["tile7"] ?? "noval"}</span></div>
                    <div bind:this={tile8} id="tile8"class={["animated-tile",{"opacity-0": !refIdxClassMap["tile8"]},`${refIdxClassMap["tile8"] ? refIdxClassMap["tile8"] : ""}`]}><span>{refIdxValueMap["tile8"] ?? "noval"}</span></div>
                    <div bind:this={tile9} id="tile9"class={["animated-tile",{"opacity-0": !refIdxClassMap["tile9"]},`${refIdxClassMap["tile9"] ? refIdxClassMap["tile9"] : ""}`]}><span>{refIdxValueMap["tile9"] ?? "noval"}</span></div>
                    <div bind:this={tile10} id="tile10"class={["animated-tile",{"opacity-0": !refIdxClassMap["tile10"]},`${refIdxClassMap["tile10"] ? refIdxClassMap["tile10"] : ""}`]}><span>{refIdxValueMap["tile10"] ?? "noval"}</span></div>
                    <div bind:this={tile11} id="tile11"class={["animated-tile",{"opacity-0": !refIdxClassMap["tile11"]},`${refIdxClassMap["tile11"] ? refIdxClassMap["tile11"] : ""}`]}><span>{refIdxValueMap["tile11"] ?? "noval"}</span></div>
                    <div bind:this={tile12} id="tile12"class={["animated-tile",{"opacity-0": !refIdxClassMap["tile12"]},`${refIdxClassMap["tile12"] ? refIdxClassMap["tile12"] : ""}`]}><span>{refIdxValueMap["tile12"] ?? "noval"}</span></div>
                    <div bind:this={tile13} id="tile13"class={["animated-tile",{"opacity-0": !refIdxClassMap["tile13"]},`${refIdxClassMap["tile13"] ? refIdxClassMap["tile13"] : ""}`]}><span>{refIdxValueMap["tile13"] ?? "noval"}</span></div>
                    <div bind:this={tile14} id="tile14"class={["animated-tile",{"opacity-0": !refIdxClassMap["tile14"]},`${refIdxClassMap["tile14"] ? refIdxClassMap["tile14"] : ""}`]}><span>{refIdxValueMap["tile14"] ?? "noval"}</span></div>
                    <div bind:this={tile15} id="tile15"class={["animated-tile",{"opacity-0": !refIdxClassMap["tile15"]},`${refIdxClassMap["tile15"] ? refIdxClassMap["tile15"] : ""}`]}><span>{refIdxValueMap["tile15"] ?? "noval"}</span></div>
                </div>
            </div>
        </div>
        <GameOverDialog score={gameState.score} onClose={() => { gameOverDialogIsOpen = false; startNewGame();}}/>
    </main>
    
    <footer class="flex justify-center">
        <div class="flex flex-col w-[450px]  gap-2">
            <span class="px-1">
                <span class="font-extrabold text-lg underline underline-offset-3 decoration-2 leading-tight">HOW TO PLAY:</span> Use your <span class="font-bold">arrow keys</span>
                to move the tiles. Tiles with the <span class="font-bold">same number merge into one</span> tile when they touch.
                Add them up to reach <span class="font-bold">2048</span>!
            </span>
        </div>
    </footer>
</div>