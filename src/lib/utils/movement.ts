
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
export function slideBoardUp(list: BoardSlotIdx[], gameState: GameState) {

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

    // For each column
    for (let i = 0; i <= 3; i++) {
        const col = [0, 1, 2, 3].map(r => list[r * 4 + i]);

        function slideCol() {
            for (let i = 0; i <= 3; i++) {
                const boardSlotIdx = col[i] as BoardSlotIdx;
                // console.log("looking at boardSlotIdx: ", boardSlotIdx)

                // If Tile to slide in boardSlot
                if (internalGameState.board[boardSlotIdx] !== undefined) {
                    const [x, y] = getCoordsFromBoardSlotIdx(boardSlotIdx);
    
                    // Try to slide as far as possible
                    for (let j = 0; j < y; j++) {
                        const potentialSlotIdx = createBoardSlotIdx(x, j);

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
        for (let i = 0; i < 3; i++) {
            const boardSlotIdx = col[i] as BoardSlotIdx;
            if (internalGameState.board[boardSlotIdx] !== undefined) {
                const [x, y] = getCoordsFromBoardSlotIdx(boardSlotIdx);

                const potentialMergeSlotIdx = createBoardSlotIdx(x, y + 1);

                // If Equal Values
                if (internalGameState.board[boardSlotIdx]?.value !== undefined
                    && internalGameState.board[boardSlotIdx]?.value === internalGameState.board[potentialMergeSlotIdx]?.value)
                {
                    // If tile merged
                    if (boardSlotIdx in mergeMap) {
                        continue; // Go to next if tile has been merged already
                    }

                    const oldSlotIdxToMergeInto= list.find((slotIdxToMergeInto) => {
                        return (gameStateBefore.board[slotIdxToMergeInto]?.refIndex === internalGameState.board[boardSlotIdx]?.refIndex);
                    });
                    const oldSlotIdxToKill = list.find((slotIdxToKill) => {
                        return (gameStateBefore.board[slotIdxToKill]?.refIndex === internalGameState.board[potentialMergeSlotIdx]?.refIndex);
                    });



                    // Add a slide animation for the tile that slides, merges, and dies
                    const [, oldY] = getCoordsFromBoardSlotIdx(oldSlotIdxToKill!);
                    const [, newY] = getCoordsFromBoardSlotIdx(boardSlotIdx); // Merge it to the one that doesn't die
                    const slideValue = Math.abs(oldY - newY);
                    // Killed Tile in merge slides is mapped to slide into position of death
                    slideMap[oldSlotIdxToKill!] = {
                        slideValue,
                        slideIdx: newY
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

        // 4. Create SlideMap
        //  TODO: hopefully a forEach on this one doesn't matter ... i don't think order matters here  ... actually its creating slidemap entries?
        col.forEach((slotIdxAfter) => {
            const tileAfter = internalGameState.board[slotIdxAfter];
            if (!tileAfter) return;

            // Find where this tile came from in gameStateBefore
            const oldSlotIdx = list.find((slotIdxBefore) => {
                return (gameStateBefore.board[slotIdxBefore]?.refIndex === tileAfter.refIndex);
            });

            if (oldSlotIdx !== undefined) {
                const [, oldY] = getCoordsFromBoardSlotIdx(oldSlotIdx);
                const [, newY] = getCoordsFromBoardSlotIdx(slotIdxAfter);
                const slideValue = Math.abs(oldY - newY);

                slideMap[oldSlotIdx] = {
                    slideValue,
                    slideIdx: newY,
                };
            }
        });
    }
    
    return [slideMap, mergeMap, internalGameState];
}


// OLD ALGO

// export function slideBoardDown(list: BoardSlotIdx[], gameState: GameState) {
//     const slideMap: SlideMap = {};
//     const mergedRecord: Record<RefIndex, boolean> = {
//         tile0: false,
//         tile1: false,
//         tile2: false,
//         tile3: false,
//         tile4: false,
//         tile5: false,
//         tile6: false,
//         tile7: false,
//         tile8: false,
//         tile9: false,
//         tile10: false,
//         tile11: false,
//         tile12: false,
//         tile13: false,
//         tile14: false,
//         tile15: false
//     };

//     // skip bottom row (index 3)
//     for (let i = 0; i <= 2; i++) {
//         const row = list.slice(i * 4, i * 4 + 4);

//         row.forEach((boardSlotIdx) => {
//             if (gameState.board[boardSlotIdx] !== undefined) {
//                 const [x, y] = getCoordsFromBoardSlotIdx(boardSlotIdx);
    
//                 for (let j = 3; j > y; j--) {
//                     const potentialSlotIdx = createBoardSlotIdx(x, j);
    
//                     if (!gameState.board[potentialSlotIdx]) {
//                         const translateDiff = Math.max(y, j) - Math.min(y, j);
//                         slideMap[boardSlotIdx] = { slideValue: translateDiff, slideIdx: j}; 

//                         const existingTile = gameState.board[boardSlotIdx];
                
//                         gameState.board[potentialSlotIdx] = existingTile;
//                         gameState.board[boardSlotIdx as BoardSlotIdx] = undefined;
//                         break;
//                     } else {
//                         if (gameState.board[potentialSlotIdx].value === gameState.board[boardSlotIdx].value) {
//                             if (mergedRecord[gameState.board[potentialSlotIdx].refIndex] === true) {
//                                 break; // Only merge once per turn
//                             }

//                             // TODO: do the slide map, and tag as a merge
//                             const translateDiff = Math.max(y, j) - Math.min(y, j);
//                             const mergeValue = gameState.board[potentialSlotIdx].value + gameState.board[boardSlotIdx].value;

//                             slideMap[boardSlotIdx] = {
//                                 slideValue: translateDiff,
//                                 slideIdx: j,
//                                 merge: true,
//                                 mergeValue
//                             } 
//                             const existingTile = gameState.board[boardSlotIdx];
            
//                             gameState.board[potentialSlotIdx] = { ...existingTile, value: mergeValue }; // update
//                             mergedRecord[existingTile.refIndex] = true;
//                             gameState.board[boardSlotIdx as BoardSlotIdx] = undefined; // empty old one
//                             break;
//                         }
//                         else {
//                             // Tile of different value, can't slide
//                             break;
//                         }
//                     }
//                 };
//             }
//         });
//     }

//     return slideMap;
// }

// export function slideBoardLeft(list: BoardSlotIdx[], gameState: GameState) {
//     const slideMap: SlideMap = {};
//     const mergedRecord: Record<RefIndex, boolean> = {
//         tile0: false,
//         tile1: false,
//         tile2: false,
//         tile3: false,
//         tile4: false,
//         tile5: false,
//         tile6: false,
//         tile7: false,
//         tile8: false,
//         tile9: false,
//         tile10: false,
//         tile11: false,
//         tile12: false,
//         tile13: false,
//         tile14: false,
//         tile15: false
//     };

//     // skips left-most row 
//     for (let i = 3; i >= 1; i--) {
//         const col = [0, 1, 2, 3].map(r => list[r * 4 + i]);
        
//         col.forEach((boardSlotIdx) => {
//             if (gameState.board[boardSlotIdx] !== undefined) {
                
//                 const [x,y] = getCoordsFromBoardSlotIdx(boardSlotIdx);

//                 for (let j = 0; j < x; j++) {
//                     const potentialSlotIdx = createBoardSlotIdx(j, y);
    
//                     // If slot isn't taken 
//                     if (!gameState.board[potentialSlotIdx]) {
//                         const translateDiff = Math.max(x, j) - Math.min(x, j);
//                         slideMap[boardSlotIdx] = { slideValue: translateDiff, slideIdx: j}; 
    
//                         // update state 
//                         const existingTile = gameState.board[boardSlotIdx];
                
//                         gameState.board[potentialSlotIdx] = existingTile; // update
//                         gameState.board[boardSlotIdx as BoardSlotIdx] = undefined; // empty old one
//                         break;
//                     } else {
//                         if (gameState.board[potentialSlotIdx].value === gameState.board[boardSlotIdx].value) {
//                             if (mergedRecord[gameState.board[potentialSlotIdx].refIndex] === true) {
//                                 break; // Only merge once per turn
//                             }

//                             const translateDiff = Math.max(x, j) - Math.min(y, j);
//                             const mergeValue = gameState.board[potentialSlotIdx].value + gameState.board[boardSlotIdx].value;

//                             slideMap[boardSlotIdx] = {
//                                 slideValue: translateDiff,
//                                 slideIdx: j,
//                                 merge: true,
//                                 mergeValue
//                             } 
//                             const existingTile = gameState.board[boardSlotIdx];
            
//                             gameState.board[potentialSlotIdx] = { ...existingTile, value: mergeValue }; // update
//                             mergedRecord[existingTile.refIndex] = true;
//                             gameState.board[boardSlotIdx as BoardSlotIdx] = undefined; // empty old one
//                             break;
//                         }
//                         else {
//                             // Tile of different value, can't slide
//                             break;
//                         }
//                     }
//                 };
//             }
//         });
//     }
//     return slideMap;
// }


// export function slideBoardRight(list: BoardSlotIdx[], gameState: GameState) {
//     const slideMap: SlideMap = {};
//     const mergedRecord: Record<RefIndex, boolean> = {
//         tile0: false,
//         tile1: false,
//         tile2: false,
//         tile3: false,
//         tile4: false,
//         tile5: false,
//         tile6: false,
//         tile7: false,
//         tile8: false,
//         tile9: false,
//         tile10: false,
//         tile11: false,
//         tile12: false,
//         tile13: false,
//         tile14: false,
//         tile15: false
//     };

//     for (let i = 0; i <= 2; i++) {
//         const col = [0, 1, 2, 3].map(r => list[r * 4 + i]);

//         col.forEach((boardSlotIdx) => {
//             if (gameState.board[boardSlotIdx] !== undefined) {
               
//                 const [x, y] = getCoordsFromBoardSlotIdx(boardSlotIdx);
    
//                 for (let j = 3; j > x; j--) {
//                     const potentialSlotIdx = createBoardSlotIdx(j, y);
    
//                     if (!gameState.board[potentialSlotIdx]) {
//                         const translateDiff = Math.max(x, j) - Math.min(x, j);
//                         slideMap[boardSlotIdx] = { slideValue: translateDiff, slideIdx: j}; 

//                         const existingTile = gameState.board[boardSlotIdx];
                
//                         gameState.board[potentialSlotIdx] = existingTile;
//                         gameState.board[boardSlotIdx as BoardSlotIdx] = undefined;
//                         break;
//                     } else {
//                         if (gameState.board[potentialSlotIdx].value === gameState.board[boardSlotIdx].value) {
//                             if (mergedRecord[gameState.board[potentialSlotIdx].refIndex] === true) {
//                                 break; // Only merge once per turn
//                             }

//                             // TODO: do the slide map, and tag as a merge
//                             const translateDiff = Math.max(x, j) - Math.min(x, j);
//                             const mergeValue = gameState.board[potentialSlotIdx].value + gameState.board[boardSlotIdx].value;

//                             slideMap[boardSlotIdx] = {
//                                 slideValue: translateDiff,
//                                 slideIdx: j,
//                                 merge: true,
//                                 mergeValue
//                             } 
//                             const existingTile = gameState.board[boardSlotIdx];
            
//                             gameState.board[potentialSlotIdx] = { ...existingTile, value: mergeValue }; // update
//                             mergedRecord[existingTile.refIndex] = true;
//                             gameState.board[boardSlotIdx as BoardSlotIdx] = undefined; // empty old one
//                             break;
//                         }
//                         else {
//                             // Tile of different value, can't slide
//                             break;
//                         }
//                     }
//                 };
//             }
//         });
//     }

//     return slideMap;
// }

