import { writable } from "svelte/store";
import type {
    Announcement,
    Facility,
    Law,
    Leader,
} from "../apps/government/types";

export const canEdit = writable(true);

export const announcements = writable<Announcement[]>([]);

export const laws = writable<Law[]>([]);

export const facilities = writable<Facility[]>([]);

export const leadership = writable<Leader[]>([]);
