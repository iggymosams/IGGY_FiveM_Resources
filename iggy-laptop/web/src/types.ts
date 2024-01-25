export interface notification {
    type: "ERROR" | "SUCCESS";
    message: string;
    duration?: number;
}

export interface App {
    id: string;
    name: string;
    icon: string;
    colour: string;
    minimized: boolean;
}
