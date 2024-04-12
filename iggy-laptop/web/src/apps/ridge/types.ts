import type { SvelteComponent } from "svelte";

export interface Tab {
    id: string;
    title: string;
    page: Page;
    url?: string;
}

export interface Page {
    content: typeof SvelteComponent<any>;
    data?: PageData;
}

export type PageData = { [key: string]: string };
