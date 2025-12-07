
import type { BoardSlotIdx, GameState, SlideMap } from "$lib/types";
import { createBoardSlotIdx, getCoordsFromBoardSlotIdx } from "./game";


export function slideBoardUp(list: BoardSlotIdx[], gameState: GameState) {
    const slideMap: SlideMap = {};

    // skips first row 
    for (let i = 1; i <= 3; i++) {
        const row =  list.slice(i * 4, i * 4 + 4);
        
        // For each slot in the row
        row.forEach((boardSlotIdx) => {
            // If active Tile
            if (gameState.board[boardSlotIdx] !== undefined) {
                const [x,y] = getCoordsFromBoardSlotIdx(boardSlotIdx);

                // Try to slide up.
                for (let j = 0; j <= y; j++) {
                    const potentialSlotIdx = createBoardSlotIdx(x, j);
    
                    // If slot isn't taken 
                    if (!gameState.board[potentialSlotIdx]) {
                        const diff = Math.max(y, j) - Math.min(y, j);
                        slideMap[boardSlotIdx] = { slideValue: diff, slideIdx: j}; 
    
                        // update state 
                        const existingTile = gameState.board[boardSlotIdx];
                
                        gameState.board[potentialSlotIdx] = existingTile; // update
                        gameState.board[boardSlotIdx as BoardSlotIdx] = undefined; // empty old one
                        break;
                    } 
                };
            }
        });
    }
    return slideMap;
}


export function slideBoardDown(list: BoardSlotIdx[], gameState: GameState) {
    const slideMap: SlideMap = {};

    // skip bottom row (index 3)
    for (let i = 2; i >= 0; i--) {
        const row = list.slice(i * 4, i * 4 + 4);

        row.forEach((boardSlotIdx) => {
            if (gameState.board[boardSlotIdx] !== undefined) {
                const [x, y] = getCoordsFromBoardSlotIdx(boardSlotIdx);
    
                for (let j = 3; j >= y; j--) {
                    const potentialSlotIdx = createBoardSlotIdx(x, j);
    
                    if (!gameState.board[potentialSlotIdx]) {
                        const diff = Math.max(y, j) - Math.min(y, j);
                        slideMap[boardSlotIdx] = { slideValue: diff, slideIdx: j}; 

                        const existingTile = gameState.board[boardSlotIdx];
                
                        gameState.board[potentialSlotIdx] = existingTile;
                        gameState.board[boardSlotIdx as BoardSlotIdx] = undefined;
                        break;
                    } 
                };
            }
        });
    }

    return slideMap;
}

export function slideBoardLeft(list: BoardSlotIdx[], gameState: GameState) {
    const slideMap: SlideMap = {};

    // skips left-most row 
    for (let i = 1; i <= 3; i++) {
        // const row =  list.slice(i * 4, i * 4 + 4);
        const col = [0, 1, 2, 3].map(r => list[r * 4 + i]);
        
        col.forEach((boardSlotIdx) => {
            if (gameState.board[boardSlotIdx] !== undefined) {
                const [x,y] = getCoordsFromBoardSlotIdx(boardSlotIdx);

                for (let j = 0; j <= x; j++) {
                    const potentialSlotIdx = createBoardSlotIdx(j, y);
    
                    // If slot isn't taken 
                    if (!gameState.board[potentialSlotIdx]) {
                        const diff = Math.max(x, j) - Math.min(x, j);
                        slideMap[boardSlotIdx] = { slideValue: diff, slideIdx: j}; 
    
                        // update state 
                        const existingTile = gameState.board[boardSlotIdx];
                
                        gameState.board[potentialSlotIdx] = existingTile; // update
                        gameState.board[boardSlotIdx as BoardSlotIdx] = undefined; // empty old one
                        break;
                    } 
                };
            }
        });
    }
    return slideMap;
}


export function slideBoardRight(list: BoardSlotIdx[], gameState: GameState) {
    const slideMap: SlideMap = {};

    // skip right-most row (index 3)
    for (let i = 2; i >= 0; i--) {
        // const row = list.slice(i * 4, i * 4 + 4);
        const col = [0, 1, 2, 3].map(r => list[r * 4 + i]);


        col.forEach((boardSlotIdx) => {
            if (gameState.board[boardSlotIdx] !== undefined) {
                const [x, y] = getCoordsFromBoardSlotIdx(boardSlotIdx);
    
                for (let j = 3; j >= x; j--) {
                    const potentialSlotIdx = createBoardSlotIdx(j, y);
    
                    if (!gameState.board[potentialSlotIdx]) {
                        const diff = Math.max(x, j) - Math.min(x, j);
                        slideMap[boardSlotIdx] = { slideValue: diff, slideIdx: j}; 

                        const existingTile = gameState.board[boardSlotIdx];
                
                        gameState.board[potentialSlotIdx] = existingTile;
                        gameState.board[boardSlotIdx as BoardSlotIdx] = undefined;
                        break;
                    } 
                };
            }
        });
    }

    return slideMap;
}

