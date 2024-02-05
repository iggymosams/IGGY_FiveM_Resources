import { Client } from "qbcore.js";
import { Command, OptionChoice } from "../shared/types";
import { Commands } from "../shared/Commands";

const QBCore: Client = global.exports["qb-core"].GetCoreObject();

function SendMenuMessage(action: string, data?: unknown) {
    SendNUIMessage({
        action: action,
        data: data,
    });
}

function RegisterNuiCallback(name: string, callback: Function) {
    RegisterNuiCallbackType(`${name}`);
    on(`__cfx_nui:${name}`, async (data: any, cb: (arg0: any) => void) => {
        cb(await callback(data));
    });
}

async function RegisterQBCallBack(name: string, ...args: any[]) {
    try {
        let data = await new Promise<any>((resolve, reject) => {
            QBCore.Functions.TriggerCallback(
                name,
                (result: any) => {
                    resolve(result);
                },
                args
            );
        });
        return data;
    } catch (error) {
        return;
    }
}

function GetVehicles() {
    let vehicles: OptionChoice[] = [];
    Object.keys(QBCore.Shared.Vehicles).forEach((v) => {
        let vehicle = QBCore.Shared.Vehicles[v];
        let veh = {
            value: v,
            label: `[${vehicle.category}] ${vehicle.name} [${vehicle.model}]`,
        };
        vehicles.push(veh);
    });
    return vehicles.sort((a, b) => a.label.localeCompare(b.label));
}

function GetItems() {
    let items: OptionChoice[] = [];
    Object.keys(QBCore.Shared.Items).forEach((key) => {
        let item = QBCore.Shared.Items[key];
        let i = {
            value: key,
            label: `[${key}] ${item.label}`,
        };
        items.push(i);
    });
    return items.sort((a, b) => a.label.localeCompare(b.label));
}

function RaycastCamera(distance: number): {
    hit: boolean;
    coords: number[];
    entity: number;
} {
    const cameraRotation = GetGameplayCamRot(0);
    const cameraCoord = GetGameplayCamCoord();
    const direction = RotationToDirection({
        x: cameraRotation[0],
        y: cameraRotation[1],
        z: cameraRotation[2],
    });
    const destination = {
        x: cameraCoord[0] + direction.x * distance,
        y: cameraCoord[1] + direction.y * distance,
        z: cameraCoord[2] + direction.z * distance,
    };
    const [a, b, c, d, e] = GetShapeTestResult(
        StartShapeTestRay(
            cameraCoord[0],
            cameraCoord[1],
            cameraCoord[2],
            destination.x,
            destination.y,
            destination.z,
            -1,
            -1,
            1
        )
    );
    return { hit: b, coords: c, entity: e };
}

function RotationToDirection(rotation: { x: number; y: number; z: number }): {
    x: number;
    y: number;
    z: number;
} {
    const adjustedRotation = {
        x: (Math.PI / 180) * rotation.x,
        y: (Math.PI / 180) * rotation.y,
        z: (Math.PI / 180) * rotation.z,
    };
    const direction = {
        x:
            -Math.sin(adjustedRotation.z) *
            Math.abs(Math.cos(adjustedRotation.x)),
        y:
            Math.cos(adjustedRotation.z) *
            Math.abs(Math.cos(adjustedRotation.x)),
        z: Math.sin(adjustedRotation.x),
    };
    return direction;
}

let performanceModIndices = [11, 12, 13, 15, 16];
function PerformanceUpgradeVehicle(vehicle: number, customWheels?: boolean) {
    customWheels = customWheels || false;
    let max;
    if (DoesEntityExist(vehicle) && IsEntityAVehicle(vehicle)) {
        SetVehicleModKit(vehicle, 0);
        performanceModIndices.forEach((mod) => {
            max = GetNumVehicleMods(vehicle, mod) - 1;
            SetVehicleMod(vehicle, mod, max, customWheels);
        });

        ToggleVehicleMod(vehicle, 18, true);
        SetVehicleFixed(vehicle);
    }
}

function isDoor(ent: any): [boolean, number?] {
    let isDoor = false;
    let result, door;
    let model = 0;

    let coords = GetEntityCoords(ent, true);
    model = GetEntityModel(ent);
    if (!model || model === 0) {
        return [isDoor, 0];
    }
    [result, door] = DoorSystemFindExistingDoor(
        coords[0],
        coords[1],
        coords[2],
        model
    );

    if (result) {
        isDoor = true;
    }
    return [isDoor, door];
}

function getCommandFromId(id: string): Command {
    for (const group of Commands) {
        for (const command of group.commands) {
            if (command.id === id) {
                return command;
            }
        }
    }
    return;
}

async function GetBoosts(): Promise<OptionChoice[]> {
    let boosts: OptionChoice[] = [];
    let config: {
        [key: string]: {
            model: string;
            name: string;
            class: "A" | "B" | "C";
        };
    } = await RegisterQBCallBack("iggy-boosting:cb:getBoostVehicles");
    Object.keys(config).forEach((v) => {
        let boost = config[v];
        let choice: OptionChoice = {
            value: boost.model,
            label: `[${boost.class}] ${boost.name} (${boost.model})`,
        };
        boosts.push(choice);
    });
    return boosts;
}

function GetJobs(): OptionChoice[] {
    let jobs: OptionChoice[] = [];
    Object.keys(QBCore.Shared.Jobs).forEach((v) => {
        let job = QBCore.Shared.Jobs[v];
        let data = {
            value: v,
            label: job.label,
        };
        jobs.push(data);
    });
    return jobs.sort((a, b) => a.label.localeCompare(b.label));
}

function GetGangs(): OptionChoice[] {
    let gangs: OptionChoice[] = [];
    Object.keys(QBCore.Shared.Gangs).forEach((v) => {
        let gang = QBCore.Shared.Gangs[v];
        let data = {
            value: v,
            label: gang.label,
        };
        gangs.push(data);
    });
    return gangs.sort((a, b) => a.label.localeCompare(b.label));
}

export {
    SendMenuMessage,
    RegisterNuiCallback,
    RegisterQBCallBack,
    GetVehicles,
    GetItems,
    RaycastCamera,
    PerformanceUpgradeVehicle,
    isDoor,
    getCommandFromId,
    GetBoosts,
    GetJobs,
    GetGangs,
};
