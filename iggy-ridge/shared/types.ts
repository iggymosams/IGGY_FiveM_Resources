export interface Tab {
    id: string;
    title: string;
    page: Page;
    url?: string;
}

export interface Page {
    content: unknown;
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
