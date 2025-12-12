
import { type BoardSlotIdx, type GameState, type MergeMap, type SlideMap } from "$lib/types";
import { createBoardSlotIdx, getCoordsFromBoardSlotIdx } from "./game";

/*
-------------
# Key points:
-------------

 - Each tile merges only once per move.

 - Merges happen in the swipe direction, starting from the edge you’re moving toward.

 - After merges, always slide again to pack tiles.

*/
export function slideBoard(direction: "up" | "down" | "left" | "right", list: BoardSlotIdx[], gameState: GameState) {
    const gameStateBefore = {
        ...gameState,
        board: { ...gameState.board },
    };
    const internalGameState = {
        ...gameState,
        board: { ...gameState.board },
    };
    const slideMap: SlideMap = {};
    const mergeMap: MergeMap = {};

    interface TraversePattern {
        start: number;
        end: number;
        step: number;
    }

    let reverseOp = false;
    let traversePattern: TraversePattern = {
        start: 0,
        end: 3,
        step: 1
    } 
    
    if (direction === "down" || direction == "right") {
        traversePattern = {
            start: 3,
            end: 0,
            step: -1
        }
        reverseOp = true;
    }

    const horizontal = (direction === "left" || direction === "right")
    function getLine(i: number): BoardSlotIdx[] {
        if (!horizontal) {
            return [0, 1, 2, 3].map(r => list[r * 4 + i]);  // column
        } else {
            const start = i * 4;
            return list.slice(start, start + 4); // row
        }
    }

    for (let i = traversePattern.start; reverseOp ? i >= traversePattern.end : i <= traversePattern.end; i += traversePattern.step) {
        const colOrRow = getLine(i);

        function slideCol() {
            for (let i_ = traversePattern.start; reverseOp ? i_ >= traversePattern.end : i_ <= traversePattern.end; i_ += traversePattern.step) {
                const boardSlotIdx = colOrRow[i_] as BoardSlotIdx;

                // If Tile to slide in boardSlot
                if (internalGameState.board[boardSlotIdx] !== undefined) {
                    const [x, y] = getCoordsFromBoardSlotIdx(boardSlotIdx);
    
                    // Try to slide as far as possible
                    const coordToComp = horizontal ? x : y; 
                    for (let j = traversePattern.start; reverseOp ? j > coordToComp : j < coordToComp; j += traversePattern.step) {
                        const potentialSlotIdx = horizontal ?  createBoardSlotIdx(j, y) : createBoardSlotIdx(x, j);

                        // If free board slot
                        if (!internalGameState.board[potentialSlotIdx]) {
                            internalGameState.board[potentialSlotIdx] = internalGameState.board[boardSlotIdx];
                            internalGameState.board[boardSlotIdx] = undefined;
                            break;
                        };
                    }
                }
            };
        }

        // 1. Slide the col up
        slideCol();

        // 2. merge the col 
        for (let i = traversePattern.start; reverseOp ? i > traversePattern.end : i < traversePattern.end; i += traversePattern.step) {
            const boardSlotIdx = colOrRow[i] as BoardSlotIdx;
            if (internalGameState.board[boardSlotIdx] !== undefined) {
                const [x, y] = getCoordsFromBoardSlotIdx(boardSlotIdx);

                const posNegDir = direction === "up" || direction === "left" ? -1 : 1; 
                const potentialMergeSlotIdx = horizontal ? createBoardSlotIdx(x + posNegDir, y) : createBoardSlotIdx(x, y + posNegDir);
                
                // If Equal Values
                if (internalGameState.board[boardSlotIdx]?.value !== undefined
                    && internalGameState.board[boardSlotIdx]?.value === internalGameState.board[potentialMergeSlotIdx]?.value)
                {
                    // If tile merged
                    if (boardSlotIdx in mergeMap) {
                        continue; // Go to next if tile has been merged already
                    }

                    const oldSlotIdxToMergeInto = list.find((slotIdxToMergeInto) => {
                        return (gameStateBefore.board[slotIdxToMergeInto]?.refIndex === internalGameState.board[boardSlotIdx]?.refIndex);
                    });
                    const oldSlotIdxToKill = list.find((slotIdxToKill) => {
                        return (gameStateBefore.board[slotIdxToKill]?.refIndex === internalGameState.board[potentialMergeSlotIdx]?.refIndex);
                    });

                    // Add a slide animation for the tile that slides, merges, and dies
                    const [oldX, oldY] = getCoordsFromBoardSlotIdx(oldSlotIdxToKill!);
                    const [newX, newY] = getCoordsFromBoardSlotIdx(boardSlotIdx); // Merge it to the one that doesn't die

                    let slideValue = Math.abs(oldY - newY);
                    if (horizontal) slideValue =  Math.abs(oldX - newX);

                    // Killed Tile in merge slides is mapped to slide into position of death
                    slideMap[oldSlotIdxToKill!] = {
                        slideValue,
                        slideIdx: horizontal ? newX : newY
                    }

                    const mergeValue = internalGameState.board[boardSlotIdx].value * 2

                    mergeMap[oldSlotIdxToMergeInto!] = { mergeValue: mergeValue, refIndex: internalGameState.board[boardSlotIdx]?.refIndex }; // Merge into
                    mergeMap[oldSlotIdxToKill!] = { mergeValue: -1, refIndex: internalGameState.board[potentialMergeSlotIdx]?.refIndex}; // Kill 

                    internalGameState.board[boardSlotIdx] = {  ...internalGameState.board[boardSlotIdx], value: mergeValue};
                    internalGameState.board[potentialMergeSlotIdx] = undefined;
                }
            }
        }

        //  3. Pack the col  (slide again)
        slideCol();
        // TODO: Watch out for when merging and a second slide happens ... this might be buggy with the internal game state but we'll see

        // 4. Create SlideMap
        colOrRow.forEach((slotIdxAfter) => {
            const tileAfter = internalGameState.board[slotIdxAfter];
            if (!tileAfter) return;

            // Find where this tile came from in gameStateBefore
            const oldSlotIdx = list.find((slotIdxBefore) => {
                return (gameStateBefore.board[slotIdxBefore]?.refIndex === tileAfter.refIndex);
            });

            if (oldSlotIdx !== undefined) {
                const [oldX, oldY] = getCoordsFromBoardSlotIdx(oldSlotIdx);
                const [newX, newY] = getCoordsFromBoardSlotIdx(slotIdxAfter);
                const  slideValue = horizontal ? Math.abs(oldX - newX) : Math.abs(oldY - newY);

                slideMap[oldSlotIdx] = {
                    slideValue,
                    slideIdx: horizontal ? newX : newY
                };
            }
        });
    }
    
    return [slideMap, mergeMap, internalGameState];
}