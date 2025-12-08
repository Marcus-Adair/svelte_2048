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

        if (!gameState.board[boardSlotIdx]){
            foundNonDupRoll = true
            return {boardSlotIdx, value: generateNewTileValue()};
        }
    }
}

