// UI
export const TRANSLATION_WIDTH = 110;
export const TILE_COLOR_MAP: Record<number, string> = {
    2: "bg-tile-2 text-tile-text-alt",
    4: "bg-tile-4 text-tile-text-alt",
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

// ANIMATION
export const SLIDE_ANIMATION_DURATION = 0.12;
export const SLIDE_ANIMATION_ANIMATION_EASE = "power1.in";

export const SCALE = 1.1;
export const SCALE_ANIMATION_DURATION_UP = 0.06;
export const SCALE_ANIMATION_DURATION_DOWN = 0.058;
export const SCALE_ANIMATION_DURATION_KILL = 0.115;
export const SCALE_ANIMATION_ANIMATION_EASE = "power1.inOut";

export const SCORE_FADE_DURATION = 0.7;
export const SCORE_XY_TRANS =  { y: -100, x: -20};
export const SCORE_EASE = "expo";

export const SPAWN_DELAY = 0.12;
export const NEW_GAME_DELAY = 0.15;

export const TURN_LOCK_TIME = 0.14;
