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

export interface Facility {
    name: string;
    description: string;
    location: string;
    coords: { x: number; y: number };
}

export interface Leader {
    name: string;
    position: string;
    image: string;
    bio: string;
}
