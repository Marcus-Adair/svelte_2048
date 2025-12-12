export const TILE_COLOR_MAP: Record<number, string> = {
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

export function getTileColorClass(value: number): string {
    if (TILE_COLOR_MAP[value]) return TILE_COLOR_MAP[value];
    return TILE_COLOR_MAP[2048];
}