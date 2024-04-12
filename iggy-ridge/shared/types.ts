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
