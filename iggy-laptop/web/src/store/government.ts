import { writable } from "svelte/store";
import type { Announcement } from "../apps/government/types";

export const canEdit = writable(true);

export const announcements = writable<Announcement[]>([]);
