import { writable } from "svelte/store";

export const visibility = writable(false);

export const hasVPN = writable(false);

export const handle = writable("");
