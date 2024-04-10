export interface Law {
    title: string;
    html?: string;
    uuid: string;
}

export interface Announcement {
    id: number;
    title: string;
    message: string;
    date: string;
}

export interface Facility {
    name: string;
    description: string;
    location: string;
}
