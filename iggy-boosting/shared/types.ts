import { DropOffLocation, Location } from "./Locations";

export type VehicleClass = "A" | "B" | "C";

export interface Vehicle {
    model: string;
    name: string;
    class: VehicleClass;
}

export interface vehicleList {
    [key: string]: Vehicle;
}

export interface Contract {
    id: number;
    class: VehicleClass;
    name: string;
    model: string;
    rewardRep: number;
    cost: number;
    rewardCrypto: number;
    time: number;
}

export interface Rep {
    level: VehicleClass;
    xp: number;
    max: number;
    min: number;
}

export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export interface Vector4 extends Vector3 {
    w: number;
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
    dropoff: DropOffLocation;
}

export interface Group {
    id: number;
    leaderCid: string;
    leaderName: string;
    players: string[];
    maxSlots: number;
}
