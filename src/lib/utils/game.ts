import type { BoardSlotIdx, GameState, Coordinate } from "$lib/types";
// ----------------------------------- //

// Helpers for indexing into the game board
export function createBoardSlotIdx( x: number, y: number): BoardSlotIdx {
    return `${x}${y}` as BoardSlotIdx;
}
export function getCoordsFromBoardSlotIdx(boardSlotIdx: BoardSlotIdx): [Coordinate, Coordinate] {
    const x = Number(boardSlotIdx[0]);
    const y = Number(boardSlotIdx[1]);
    return [x as Coordinate, y as Coordinate]
}

// Returns initialized GameState obj
export function initNewGameState(best?: number): GameState {
    const newGameState: GameState = {
        board: {
            "00": undefined, "01": undefined, "02": undefined, "03": undefined, // Row 0
            "10": undefined, "11": undefined, "12": undefined, "13": undefined,// Row 1
            "20": undefined, "21": undefined, "22": undefined, "23": undefined, // Row 2
            "30": undefined, "31": undefined, "32": undefined, "33": undefined, // Row 3
        },
        score: 0,
        step: 0,
        best: best ?? 0,
    } 

    // Generate/set first Tile
    const x = Math.floor(Math.random() * 4) as Coordinate;
    const y = Math.floor(Math.random() * 4) as Coordinate;
  
    const firstStartingVal = generateNewTileValue();

    newGameState.board[createBoardSlotIdx(x,y)] = {
        value: firstStartingVal,
        refIndex: "tile0"
    };


    const secondStartingVal = generateNewTileValue();

    let foundNonDupRoll = false;
    let x2;
    let y2;
    while (!foundNonDupRoll) {
        x2  = Math.floor(Math.random() * 4) as Coordinate;
        y2 = Math.floor(Math.random() * 4) as Coordinate;
        if (createBoardSlotIdx(x,y) !== createBoardSlotIdx(x2,y2)){
            foundNonDupRoll = true
        }
    }
    newGameState.board[createBoardSlotIdx(x2 as number,y2 as number)] = {
        value: secondStartingVal,
        refIndex: "tile1"
    };

    return newGameState;
}


// Randomly generate 2 or 4 with a bias
export function generateNewTileValue(){
    return  Math.random() < 0.6 ? 2 : 4;
}
// Generate random space roll (BoardSlotIdx) and new tile value
export function generateNewTileForGameState(gameState: GameState): {boardSlotIdx: BoardSlotIdx, value: number} | undefined {

    // TODO: maybe first scan the board and only generate a tile within free spots,
    let foundNonDupRoll = false;
    let x;
    let y;
    while (!foundNonDupRoll) {
        x  = Math.floor(Math.random() * 4) as Coordinate;
        y = Math.floor(Math.random() * 4) as Coordinate;

        const boardSlotIdx = createBoardSlotIdx(x,y);

        if (gameState.board[boardSlotIdx] === undefined){
            foundNonDupRoll = true
            return {boardSlotIdx, value: generateNewTileValue()};
        }
    }
}

export function spaceLeftOnBoard(gameState: GameState): boolean {
    let spaceLeft = false;
    Object.entries(gameState.board).forEach(([, boardSlot]) => {
        if (boardSlot === undefined){
            spaceLeft = true;
        }
    });
    return spaceLeft;
}

export function canSlideTile(gameState: GameState): boolean {
    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
            const value = gameState.board[`${x}${y}` as BoardSlotIdx]?.value;
            if (!value) return true; // Empty spot (can slide)

            const adjacentNeighbors: [number, number][] = [
                [x - 1, y],
                [x + 1, y],
                [x, y - 1],
                [x, y + 1],
            ];

            for (const [nX, nY] of adjacentNeighbors) {
                if (nX < 0 || nX > 3 || nY < 0 || nY > 3) continue;

                const neighborValue = gameState.board[`${nX}${nY}` as BoardSlotIdx]?.value;
                if (neighborValue === value) return true; // If can merge with neighbor
            }
        }
    }
    return false;
}
