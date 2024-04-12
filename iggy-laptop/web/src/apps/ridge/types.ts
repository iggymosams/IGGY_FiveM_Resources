import type { SvelteComponent } from "svelte";

export interface Tab {
    id: string;
    title: string;
    page: Page;
    url?: string;
}

export interface Page {
    content: typeof SvelteComponent<any>;
    data?: any;
}
