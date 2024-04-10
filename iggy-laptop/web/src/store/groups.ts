import { writable } from "svelte/store";
import { type Group } from "../apps/groups/types";

export const groups = writable<Group[]>([]);

export const group = writable<Group | undefined>();

export const isGroupHost = writable(false);

export const requests = writable<String[]>([]);
