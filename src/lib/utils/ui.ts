import { TILE_COLOR_MAP } from "$lib/consts";
import { writable } from "svelte/store";

export function getTileColorClass(value: number): string {
    if (TILE_COLOR_MAP[value]) return TILE_COLOR_MAP[value];
    return TILE_COLOR_MAP[2048];
}


export type Theme =
	| "theme-classic"
    | "theme-dark"
	| "theme-cyberpunk"

export const theme = writable<Theme>("theme-classic");