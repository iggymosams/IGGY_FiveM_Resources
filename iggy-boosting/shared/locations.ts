import { DropOffLocation, SpawnLocation } from "./types";

interface locationList {
    [key: string]: SpawnLocation[];
}
export const SPAWN_LOCATIONS: locationList = {
    ["C"]: [
        {
            vector4: {
                x: -1017.0287475585938,
                y: -3328.005615234375,
                z: 13.944490432739258,
                w: 66.45962524414062,
            },
            inUse: false,
        },
    ],
};

export const DROP_OFF_LOCATIONS: DropOffLocation[] = [
    {
        vector3: {
            x: -1274.8028564453125,
            y: -3178.2060546875,
            z: 13.944380760192871,
        },
        inUse: false,
    },
];
