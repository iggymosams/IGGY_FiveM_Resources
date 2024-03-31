import { writable } from "svelte/store";
import { type ConfigApp } from "../utils/apps";

export const openedApps = writable<ConfigApp[]>([]);

export const visibility = writable(false);

export const hasVPN = writable(false);

export const handle = writable("");
