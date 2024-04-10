import { writable } from "svelte/store";
import type { Announcement, Law } from "../apps/government/types";

export const canEdit = writable(true);

export const announcements = writable<Announcement[]>([]);

export const laws = writable<Law[]>([]);
