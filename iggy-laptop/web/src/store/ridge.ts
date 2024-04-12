import { writable } from "svelte/store";
import type { Tab } from "../apps/ridge/types";
import HomePage from "../apps/ridge/components/HomePage.svelte";

export const tabs = writable<Tab[]>([
    { title: "New tab", id: "Default Tab", page: { content: HomePage } },
]);

export const activeTab = writable<Tab>();

export const progress = writable<number>(0);
