import { writable } from "svelte/store";
import type { ActiveContract, Contract, Rep } from "../apps/boosting/types";

export const rep = writable<Rep>();

export const inQueue = writable(false);

export const contracts = writable<Contract[]>([]);

export const activeContract = writable<ActiveContract | undefined>();
