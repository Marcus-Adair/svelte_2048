import type { BoardSlotIdx, GameState, Coordinate } from "$lib/types";
// ----------------------------------- //

// Helpers for indexing into the game board
export function createBoardSlotIdx( x: number, y: number): BoardSlotIdx {
    return `${x}${y}` as BoardSlotIdx;
}
export function getCoordsFromBoardSlotIdx(boardSlotIdx: BoardSlotIdx): [number, number] {
    const x = Number(boardSlotIdx[0]);
    const y = Number(boardSlotIdx[1]);
    return [x,y]
}

// Returns initialized GameState obj
export function initNewGameState(): GameState {
    const newGameState: GameState = {
        board: {
            "00": undefined, "01": undefined, "02": undefined, "03": undefined, // Row 0
            "10": undefined, "11": undefined, "12": undefined, "13": undefined,// Row 1
            "20": undefined, "21": undefined, "22": undefined, "23": undefined, // Row 2
            "30": undefined, "31": undefined, "32": undefined, "33": undefined, // Row 3
        },
        score: 0,
        step: 0,
    } 

    // Generate/set first Tile
    const x = Math.floor(Math.random() * 4) as Coordinate;
    const y = Math.floor(Math.random() * 4) as Coordinate;
    // const x = 0;
    // const y = 0;

    const firstStartingVal = generateNewTileValue();

    newGameState.board[createBoardSlotIdx(x,y)] = {
        value: firstStartingVal,
        // value: 2,
        refIndex: "tile0"
    };


    const secondStartingVal = generateNewTileValue();

    let foundNonDupRoll = false;
    let x2;
    let y2;
    while (!foundNonDupRoll) {
        x2  = Math.floor(Math.random() * 4) as Coordinate;
        y2 = Math.floor(Math.random() * 4) as Coordinate;
        // x2  = 3;
        // y2 = 0;
        if (createBoardSlotIdx(x,y) !== createBoardSlotIdx(x2,y2)){
            foundNonDupRoll = true
        }
    }
    newGameState.board[createBoardSlotIdx(x2 as number,y2 as number)] = {
        value: secondStartingVal,
        // value: 2,
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

// Returns if there's space left on the board or not for spawning a new tile
export function spaceLeftOnBoard(gameState: GameState): boolean {
    let spaceLeft = false;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(gameState.board).forEach(([_, boardSlot]) => {
        if (boardSlot === undefined){
            spaceLeft = true;
        }
    });
    return spaceLeft;
}

// For styling tiles
export const TileClassMap: Record<number, string> = {
	2: "bg-tile-2 text-tile-text-dark",
	4: "bg-tile-4 text-tile-text-dark",
	8: "bg-tile-8 text-tile-text",
	16: "bg-tile-16 text-tile-text",
	32: "bg-tile-32 text-tile-text",
	64: "bg-tile-64 text-tile-text",
	128: "bg-tile-128 text-tile-text",
	256: "bg-tile-256 text-tile-text",
	512: "bg-tile-512 text-tile-text",
	1024: "bg-tile-1024 text-tile-text",
	2048: "bg-tile-2048 text-tile-text",
};
export function getTileClassFromValue(value: number) {
	return TileClassMap[value] ?? TileClassMap[2048];
}