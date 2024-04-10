import { writable } from "svelte/store";
import { type LaptopApp } from "../utils/apps";

export const openedApps = writable<LaptopApp[]>([]);

export const visibility = writable(false);

export const hasVPN = writable(false);

export const handle = writable("");
