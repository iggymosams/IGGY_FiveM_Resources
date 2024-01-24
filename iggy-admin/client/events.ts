import { ToggleNoClipMode } from "./noclip";
import { Delay } from "../shared/utils";
import { SelectedEntity } from "./client";
import { isDoor, PerformanceUpgradeVehicle, SendMenuMessage } from "./cl_utils";

let SpawnedVehicle: number;

onNet("iggy-admin:client:toggleNoClip", () => {
    ToggleNoClipMode();
});

onNet("iggy-admin:client:killTarget", () => {
    SetEntityHealth(PlayerPedId(), 0);
});

onNet("iggy-admin:client:openInventory", (target: number) => {
    emitNet("inventory:server:OpenInventory", "otherplayer", target);
});

onNet("iggy-admin:client:openClothing", () => {
    TriggerEvent("qb-clothing:client:openMenu");
});

onNet("iggy-admin:client:spawnVehicle", async (model: string) => {
    let hash = GetHashKey(model);
    RequestModel(hash);
    let waiting = 0;
    while (!HasModelLoaded(hash)) {
        waiting = waiting + 100;
        await Delay(100);
        if (waiting > 5000) {
            TriggerEvent(
                "QBCore:Notify",
                "Could not load the vehicle model in time, a crash was prevented.",
                "error",
                5000
            );
            break;
        }
    }
    let coords = GetOffsetFromEntityInWorldCoords(PlayerPedId(), 0.0, 5.0, 0.0);
    SpawnedVehicle = CreateVehicle(
        hash,
        coords[0],
        coords[1],
        coords[2],
        GetEntityHeading(PlayerPedId()),
        true,
        true
    );
    SetModelAsNoLongerNeeded(hash);
    let plate = GetVehicleNumberPlateText(SpawnedVehicle);
    emitNet("qb-vehiclekeys:server:AcquireVehicleKeys", plate);
    global.exports["LegacyFuel"].SetFuel(SpawnedVehicle, 100);
});

onNet("iggy-admin:client:seatInSpawnedVeh", () => {
    if (DoesEntityExist(SpawnedVehicle)) {
        TaskWarpPedIntoVehicle(PlayerPedId(), SpawnedVehicle, -1);
    }
});

onNet("iggy-admin:client:fixVehicle", () => {
    let vehicle = GetVehiclePedIsIn(PlayerPedId(), false);
    if (vehicle !== 0) {
        SetVehicleEngineHealth(vehicle, 100);
        SetVehicleEngineOn(vehicle, true, true, false);
        SetVehicleFixed(vehicle);
    }
});

onNet("iggy-admin:client:copyVec3", () => {
    let c = GetEntityCoords(PlayerPedId(), true);
    SendMenuMessage("copyText", `vector3(${c[0]}, ${c[1]}, ${c[2]})`);
});

onNet("iggy-admin:client:copyVec4", () => {
    let c = GetEntityCoords(PlayerPedId(), true);
    let h = GetEntityHeading(PlayerPedId());
    SendMenuMessage("copyText", `vector4(${c[0]}, ${c[1]}, ${c[2]}, ${h})`);
});

onNet("iggy-admin:client:SM:killPlayer", () => {
    const id = SelectedEntity;
    TriggerServerEvent("iggy-admin:server:killTarget", {
        target: { serverId: id },
    });
});

onNet("iggy-admin:client:SM:revivePlayer", () => {
    const id = SelectedEntity;
    TriggerServerEvent("iggy-admin:server:reviveTarget", {
        target: { serverId: id },
    });
});

onNet("iggy-admin:client:SM:freezePlayer", () => {
    const id = SelectedEntity;
    TriggerServerEvent("iggy-admin:server:freezeTarget", {
        target: {
            serverId: id,
            display: GetPlayerName(GetPlayerFromServerId(id)) + " (" + id + ")",
        },
    });
});

onNet("iggy-admin:client:SM:spectatePlayer", () => {
    const id = SelectedEntity;
    emitNet("iggy-admin:server:spectate", {
        target: { serverId: id },
    });
});

onNet("iggy-admin:client:SM:deleteEntity", () => {
    if (NetworkGetEntityIsNetworked(SelectedEntity)) {
        emitNet(
            "iggy-admin:server:SM:deleteEntity",
            NetworkGetNetworkIdFromEntity(SelectedEntity)
        );
    } else {
        SetEntityAsMissionEntity(SelectedEntity, true, true);
        NetworkRegisterEntityAsNetworked(SelectedEntity);
        emitNet(
            "iggy-admin:server:SM:deleteEntity",
            NetworkGetNetworkIdFromEntity(SelectedEntity)
        );
    }
});

onNet("iggy-admin:client:SM:repairVehicle", () => {
    const vehicle = SelectedEntity;
    SetVehicleEngineHealth(vehicle, 100);
    SetVehicleEngineOn(vehicle, true, true, false);
    SetVehicleFixed(vehicle);
});

onNet("iggy-admin:client:SM:cleanVehicle", () => {
    const vehicle = SelectedEntity;
    SetVehicleDirtLevel(vehicle, 0);
});

onNet("iggy-admin:client:SM:maxmodsVehicle", () => {
    PerformanceUpgradeVehicle(SelectedEntity);
});

onNet("iggy-admin:client:SM:refuelVehicle", () => {
    (Entity(SelectedEntity) as any).state.fuel = 100.0;
    global.exports["LegacyFuel"].SetFuel(SelectedEntity, 100.0);
});

onNet("iggy-admin:client:SM:warpintoVehicle", () => {
    const t = GetVehicleModelNumberOfSeats(GetEntityModel(SelectedEntity));
    for (let i = -1; i <= t; i++) {
        if (IsVehicleSeatFree(SelectedEntity, i)) {
            TaskWarpPedIntoVehicle(PlayerPedId(), SelectedEntity, i);
            break;
        }
    }
});

onNet("iggy-admin:client:SM:getKeys", () => {
    const plate = GetVehicleNumberPlateText(SelectedEntity);
    TriggerServerEvent("qb-vehiclekeys:server:AcquireVehicleKeys", plate);
});

onNet("iggy-admin:client:SM:killPed", () => {
    SetEntityHealth(SelectedEntity, 0);
});

onNet("iggy-admin:client:SM:ignitePed", () => {
    StartEntityFire(SelectedEntity);
});

onNet("iggy-admin:client:SM:lockDoor", () => {
    const [is, door] = isDoor(SelectedEntity);
    if (is) {
        DoorSystemSetDoorState(door, 1, false, false);
    }
});

onNet("iggy-admin:client:SM:unlockDoor", () => {
    const [is, door] = isDoor(SelectedEntity);
    if (is) {
        DoorSystemSetDoorState(door, 0, false, false);
    }
});
