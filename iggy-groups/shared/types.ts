export interface GroupPlayer {
    name: string;
    src: number;
    cid: string;
}

export type GroupType = "PUBLIC" | "PRIVATE";

export interface Group {
    id: number;
    leader: GroupPlayer;
    players: GroupPlayer[];
    requests: GroupPlayer[];
    type: GroupType;
}

export interface PublicGroup {
    id: number;
    leader: string;
    players: string[];
}
