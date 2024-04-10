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
    cost: number;
    rewardCrypto: number;
    time: number;
}

export type ActiveContract = Contract & {
    plate: string;
};
