import type { BoardSlotIdx, GameState, Coordinate } from "$lib/types";
// ----------------------------------- //

export function createBoardSlotIdx( x: number, y: number): BoardSlotIdx {
    return `${x}${y}` as BoardSlotIdx;
}
export function getCoordsFromBoardSlotIdx(boardSlotIdx: BoardSlotIdx): [number, number] {
    const x = Number(boardSlotIdx[0]);
    const y = Number(boardSlotIdx[1]);
    return [x,y]
}

export function initNewGameState() {
    const newGameState: GameState = {
        board: {
            // Row 0
            "00": undefined,
            "01": undefined,
            "02": undefined,
            "03": undefined,
          
            // Row 1
            "10": undefined,
            "11": undefined,
            "12": undefined,
            "13": undefined,
    
            // Row 2
            "20": undefined,
            "21": undefined,
            "22": undefined,
            "23": undefined,
    
            // Row 3
            "30": undefined,
            "31": undefined,
            "32": undefined,
            "33": undefined,
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


export function generateNewTileValue(){
    return  Math.random() < 0.6 ? 2 : 4;
}

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

export function getTileClassFromValue(value: number) {
	if (value === 2) return "bg-tile-2 text-tile-text-dark";
	if (value === 4) return "bg-tile-4 text-tile-text-dark";
	if (value === 8) return "bg-tile-8 text-tile-text";
	if (value === 16) return "bg-tile-16 text-tile-text";
	if (value === 32) return "bg-tile-32 text-tile-text";
	if (value === 64) return "bg-tile-64 text-tile-text";
	if (value === 128) return "bg-tile-128 text-tile-text";
	if (value === 256) return "bg-tile-256 text-tile-text";
	if (value === 512) return "bg-tile-512 text-tile-text";
	if (value === 1024) return "bg-tile-1024 text-tile-text";

    // default
    return "bg-tile-2048";
}