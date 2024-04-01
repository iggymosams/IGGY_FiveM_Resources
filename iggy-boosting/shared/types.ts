export type VehicleClass = "A" | "B" | "C";

export interface Rep {
    level: VehicleClass;
    xp: number;
    max: number;
    min: number;
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

export type ActiveContract = Omit<Contract, "time"> & {
    plate: string;
    netId: number;
    spawn: SpawnLocation;
    dropoff: DropOffLocation;
    hacksFailed: number;
};

export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export interface Vector4 extends Vector3 {
    w: number;
}

export interface SpawnLocation {
    vector4: Vector4;
    inUse: boolean;
}

export interface DropOffLocation {
    vector3: Vector3;
    inUse: boolean;
}
