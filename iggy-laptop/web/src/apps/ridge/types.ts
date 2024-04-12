import type { SvelteComponent } from "svelte";

export interface Tab {
    id: string;
    title: string;
    page: Page;
    url?: string;
    editing?: boolean;
}

export interface Page {
    content: typeof SvelteComponent<any>;
    data?: PageData;
}

export type PageData = { [key: string]: string };

export interface Site {
    title: string;
    url: string;
    page: {
        template: string;
        data: PageData;
    };
}

export interface SearchResult {
    title: string;
    url: string;
}
