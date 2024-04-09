import { writable } from "svelte/store";
import type { Announcement, tab } from "../apps/government/types";

export const canEdit = writable(true);

export const announcements = writable<Announcement[]>([]);

export const laws = writable<tab[]>([]);
