export interface Announcement {
    id: number;
    title: string;
    message: string;
    date: string;
}

export interface Law {
    title: string;
    html?: string;
    uuid: string;
}
