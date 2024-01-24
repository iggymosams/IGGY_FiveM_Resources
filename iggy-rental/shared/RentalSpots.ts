export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export interface Vector4 extends Vector3 {
    w: number;
}

export interface RentalSpot {
    label: string;
    showBlip: boolean;
    blipCoords: Vector3;
    blipName?: string;
    blipNumber?: number;
    blipColour?: number;
    parkingSpots: Vector4[];
    parkingIndex?: number;
    pedLocation: Vector4;
    pedModel: string;
    ped?: number;
}

export let RentalSpots: RentalSpot[] = [
    {
        label: "City",
        showBlip: true,
        blipCoords: { x: 230, y: -785, z: 30 },
        blipName: "City Rental",
        blipNumber: 357,
        parkingSpots: [
            { x: 214.9, y: -804, z: 30.4, w: 70.7 },
            { x: 216, y: -801.6, z: 30.4, w: 68.7 },
        ],
        pedLocation: { x: 214.7, y: -806.6, z: 29.8, w: 333.9 },
        pedModel: "csb_reporter",
    },
    {
        label: "Sandy",
        showBlip: true,
        blipCoords: { x: 955.4, y: 3619.9, z: 32.6 },
        blipName: "City Rental",
        blipNumber: 357,
        parkingSpots: [
            { x: 952.4, y: 3615.5, z: 32.1, w: 273.5 },
            { x: 952.4, y: 3619, z: 32.0, w: 270.2 },
            { x: 952.4, y: 3622.7, z: 32.0, w: 270.2 },
        ],
        pedLocation: { x: 955.4, y: 3619.9, z: 31.65, w: 90 },
        pedModel: "csb_reporter",
    },
];
