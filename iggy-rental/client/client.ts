import { Client } from "qbcore.js";
import { RentalSpot, RentalSpots, Vector4 } from "./../shared/RentalSpots";
import { VEHICLES } from "./../shared/Vehicles";
import { Delay, CalcDist } from "./../shared/utils";

const QBCore: Client = global.exports["qb-core"].GetCoreObject();

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "rental:getVehicles",
    () => {
        return VEHICLES;
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "rental:rentvehicle",
    (model: string) => {
        emitNet("iggy-rental:server:rentvehicle", model);

        return true;
    }
);

onNet("iggy-rental:client:error-price", () => {
    global.exports["iggy-laptop"].SendAppMessage("base", "notification", {
        type: "ERROR",
        message: "You dont have enough money in your bank.",
    });
});

onNet("iggy-rental:client:error-spot", () => {
    global.exports["iggy-laptop"].SendAppMessage("base", "notification", {
        type: "ERROR",
        message: "Unable to find parking spot. Please try again later",
    });
});

onNet("iggy-rental:client:success", () => {
    global.exports["iggy-laptop"].SendAppMessage("base", "notification", {
        type: "SUCCESS",
        message: "The vehicle is waiting for you at your nearest spot",
    });
});

onNet(
    "iggy-rental:client:spawnVehicle",
    async (model: string, coords: Vector4, index: number) => {
        let hash = GetHashKey(model);
        RequestModel(hash);
        while (!HasModelLoaded(hash)) {
            await Delay(10);
        }
        let veh = CreateVehicle(
            hash,
            coords.x,
            coords.y,
            coords.z,
            coords.w,
            false,
            false
        );
        let netId = NetworkGetNetworkIdFromEntity(veh);
        SetVehicleHasBeenOwnedByPlayer(veh, true);
        SetNetworkIdCanMigrate(netId, true);
        SetVehRadioStation(veh, "OFF");
        SetModelAsNoLongerNeeded(hash);
        let plate = GetVehicleNumberPlateText(veh);
        emitNet("iggy-rental:server:spawnedVehicle", netId, index, plate);
    }
);

onNet("iggy-rental:client:giveKeys", (plate: string) => {
    emitNet("qb-vehiclekeys:server:AcquireVehicleKeys", plate);
});

async function loadBlips() {
    RentalSpots.forEach((spot) => {
        if (spot.showBlip) {
            let blip = AddBlipForCoord(
                spot.blipCoords.x,
                spot.blipCoords.y,
                spot.blipCoords.z
            );
            let blipColour = spot.blipColour || 3;
            SetBlipSprite(blip, spot.blipNumber);
            SetBlipDisplay(blip, 4);
            SetBlipScale(blip, 0.6);
            SetBlipColour(blip, blipColour);
            BeginTextCommandSetBlipName("STRING");
            AddTextComponentSubstringPlayerName(spot.blipName);
            EndTextCommandSetBlipName(blip);
        }
    });
}

//TODO: WHAT WHAS I THINKING CREATING THE PED IN A LOOP ALSO ADD A DISTANCE CHECK TO LOOP TO OPTIMIZE.
// I AM DUMB
async function loadNPCs() {
    while (true) {
        let coords = GetEntityCoords(PlayerPedId(), false);

        RentalSpots.forEach(async (spot, i) => {
            let dist = CalcDist(
                coords[0],
                coords[1],
                coords[2],
                spot.pedLocation.x,
                spot.pedLocation.y,
                spot.pedLocation.z
            );
            if (dist <= 25.0) {
                if (!DoesEntityExist(spot.ped)) {
                    let hash = GetHashKey(spot.pedModel);
                    RequestModel(hash);
                    while (!HasModelLoaded(hash)) {
                        await Delay(10);
                    }
                    let ped = CreatePed(
                        5,
                        hash,
                        spot.pedLocation.x,
                        spot.pedLocation.y,
                        spot.pedLocation.z,
                        spot.pedLocation.w,
                        false,
                        true
                    );
                    FreezeEntityPosition(ped, true);
                    SetEntityInvincible(ped, true);
                    SetBlockingOfNonTemporaryEvents(ped, true);
                    TaskStartScenarioInPlace(
                        ped,
                        "WORLD_HUMAN_CLIPBOARD",
                        0,
                        true
                    );
                    spot.ped = ped;
                }
            } else {
                await Delay(2000);
            }

            if (dist <= 5) {
                QBCore.Functions.DrawText3D(
                    spot.pedLocation.x,
                    spot.pedLocation.y,
                    spot.pedLocation.z + 1,
                    "~g~[E]~b~ to claim keys and papers"
                );
                if (IsControlJustPressed(0, 38)) {
                    TriggerServerEvent("iggy-rental:server:claimKeys", i);
                }
            }
        });
        await Delay(1);
    }
}

function main() {
    loadBlips();
    loadNPCs();
}
main();
