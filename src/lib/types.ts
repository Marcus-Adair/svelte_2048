export type Coordinate = 0 | 1 | 2 | 3;

export type BoardSlotIdx = "00" | "01" | "02" | "03" |
                           "10" | "11" | "12" | "13" |
                           "20" | "21" | "22" | "23" |
                           "30" | "31" | "32" | "33";
                        
export const boardSlotIdxList: BoardSlotIdx[] = [
    "00","10","20","30",
    "01","11","21","31",
    "02","12","22","32",
    "03","13","23","33"
];    

export type RefIndex =
  | "tile0"  | "tile1"  | "tile2"  | "tile3"
  | "tile4"  | "tile5"  | "tile6"  | "tile7"
  | "tile8"  | "tile9"  | "tile10" | "tile11"
  | "tile12" | "tile13" | "tile14" | "tile15";

export type ScoreIndex =
  | "score0"  | "score1"  | "score2" 
  | "score3"  | "score4"  | "score5" ;
  export type BestIndex =
  | "best0"  | "best1"  | "best2" 
  | "best3"  | "best4"  | "best5" ;

export interface Tile {
    value: number;
    refIndex: RefIndex; // Ref to the name of the HTMLDivElement for animation
}

export interface GameState {
    board: Record<BoardSlotIdx, Tile | undefined>;
    step: number;
    score: number;
    best: number;
}

export type SlideMap = Record<
    string,
    { 
        slideValue: number; // Number of spaces to slide
        slideIdx: number // New Coordinate after sliding (can be for either x or y axis)
    } | undefined 
>

export type MergeMap = Record<
    string,
    {
        mergeValue: number; // If mergeValue is undefined then the Tile got killed in merge
        refIndex: RefIndex; // Div to slide

    } | undefined
>