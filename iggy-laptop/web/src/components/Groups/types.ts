import type { Player } from "@zerio2/qbcore.js";

export interface Group {
    id: number;
    leader: Player;
    players: Player[];
}
