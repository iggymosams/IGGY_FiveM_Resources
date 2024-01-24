import {
    RentalSpot,
    RentalSpots,
    Vector3,
    Vector4,
} from "./../shared/RentalSpots";
import { Player, Server } from "qbcore.js";
import { VEHICLES } from "./../shared/Vehicles";
import { calcDist } from "./../shared/utils";

const QBCore: Server = global.exports["qb-core"].GetCoreObject();

interface RentedVehicle {
    netId: number;
    player: number;
    spot: number;
    plate: string;
}

let RentedVehicles: RentedVehicle[] = [];

interface vehicle {
    model: string;
    name: string;
    price: number;
    image: string;
}

onNet("iggy-rental:server:rentvehicle", (model: string) => {
    let vehicle = getVehicleFromModel(model);
    let price = vehicle.price;

    let player: Player = QBCore.Functions.GetPlayer(source);
    // TODO: Only allow 1 vehicle at a time

    let ped = GetPlayerPed(source.toString());
    let { spot, index } = findNearestRentalSpot(ped);
    if (!spot) {
        emitNet("iggy-rental:client:error-spot", source);
        return;
    }

    if (!canAfford(player, price)) {
        emitNet("iggy-rental:client:error-price", source);
        return;
    } else {
        player.Functions.RemoveMoney(
            "bank",
            price,
            `Rented ${vehicle.model} for ${price}`
        );
        emitNet("iggy-rental:client:success", source);
    }

    if (
        spot.parkingIndex === undefined ||
        spot.parkingIndex === spot.parkingSpots.length
    ) {
        spot.parkingIndex = 0;
    }
    let parkingIndex = spot.parkingIndex;
    let parkingSpot = spot.parkingSpots[parkingIndex];
    spot.parkingIndex = ++spot.parkingIndex;
    emitNet(
        "iggy-rental:client:spawnVehicle",
        source,
        vehicle.model,
        parkingSpot,
        index
    );
});

function getVehicleFromModel(model: string): vehicle {
    return VEHICLES.find((vehicle) => vehicle.model === model);
}

function canAfford(player: Player, price: number): boolean {
    if (player.PlayerData.money.bank < price) {
        return false;
    }

    return true;
}

function findNearestRentalSpot(ped: number): {
    spot: RentalSpot;
    index: number;
} {
    let coords = GetEntityCoords(ped);

    let bestSpot: RentalSpot;
    let bestDist: number = Number.MAX_SAFE_INTEGER;
    let spotIndex: number;
    RentalSpots.forEach((spot, i) => {
        let dist = calcDist(
            coords[0],
            coords[1],
            coords[2],
            spot.blipCoords.x,
            spot.blipCoords.y,
            spot.blipCoords.z
        );
        if (dist < bestDist) {
            bestSpot = spot;
            bestDist = dist;
            spotIndex = i;
        }
    });
    return { spot: bestSpot, index: spotIndex };
}

onNet(
    "iggy-rental:server:spawnedVehicle",
    (netId: number, spot: number, plate: string) => {
        RentedVehicles.push({
            netId: netId,
            player: source,
            spot: spot,
            plate: plate,
        });
    }
);

onNet("iggy-rental:server:claimKeys", (spot: number) => {
    let filter = RentedVehicles.filter((vehicle) => {
        return spot === vehicle.spot && vehicle.player === source;
    });
    let Player = QBCore.Functions.GetPlayer(source);

    filter.forEach((vehicle) => {
        let info = {
            plate: vehicle.plate,
        };
        emitNet("iggy-rental:client:giveKeys", source, vehicle.plate);
        TriggerClientEvent(
            "inventory:client:ItemBox",
            source,
            QBCore.Shared.Items["rentalpapers"],
            "add"
        );
        Player.Functions.AddItem("rentalpapers", 1, 1, info);
    });
});

QBCore.Functions.CreateUseableItem("rentalpapers", (src, item) => {
    emitNet(
        "QBCore:Notify",
        src,
        `These papers are for ${item.info.plate}`,
        "success"
    );
});
