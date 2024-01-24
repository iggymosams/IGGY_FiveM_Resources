export type VehicleClass = "A" | "B" | "C";

export interface Rep {
    level: VehicleClass;
    xp: number;
    max: number;
    min: number;
}

export interface Contract {
    class: VehicleClass;
    model: string;
    name: string;
    rewardRep: number;
    cost: number;
    rewardCrypto: number;
    time: number;
    playerCid: string;
    id: number;
}

export interface Group {
    id: number;
    leaderCid: string;
    leaderName: string;
    players: string[];
    maxSlots: number;
}

export interface JoinRequest {
    cid: string;
    name: string;
}

export interface RunningContract {
    id: number;
    location: Location;
    model: string;
    class: VehicleClass;
    contract: Contract;
    vehicle?: number;
    plate?: string;
    hacksFailed: number;
}
