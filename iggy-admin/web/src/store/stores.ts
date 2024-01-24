import type { Player } from "../types/types";
import { writable } from "svelte/store";

export const visibility = writable(false);

export const target = writable<Player>();
