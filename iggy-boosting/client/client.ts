import { Client } from "@zerio2/qbcore.js";
import { ActiveContract, Contract, Rep, Vector3 } from "../shared/types";
import { CalcDist, Delay } from "../shared/utils";

let active: ActiveContract;
let blip: number;

const QBCore: Client = global.exports["qb-core"].GetCoreObject();

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "boosting:getRep",
    async () => {
        emitNet("iggy-boosting:server:getRep");
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "boosting:toggleQueue",
    async () => {
        emitNet("iggy-boosting:server:toggleQueue");
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "boosting:startContract",
    async (id: number) => {
        emitNet("iggy-boosting:server:startContract", id);
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "boosting:getQbit",
    async () => {
        global.exports["iggy-laptop"].SendAppMessage(
            "boosting",
            "updateQbit",
            QBCore.Functions.GetPlayerData().money["crypto"]
        );
    }
);

onNet("iggy-boosting:client:updateRep", (rep: Rep) => {
    global.exports["iggy-laptop"].SendAppMessage("boosting", "updateRep", rep);
});

onNet("iggy-boosting:client:updateContracts", (contracts: Contract[]) => {
    global.exports["iggy-laptop"].SendAppMessage(
        "boosting",
        "updateContracts",
        contracts
    );
});

onNet("iggy-boosting:client:toggleQueue", (inQueue: boolean) => {
    global.exports["iggy-laptop"].SendAppMessage(
        "boosting",
        "toggleQueue",
        inQueue
    );
});

onNet("iggy-boosting:client:toggleQueue", (inQueue: boolean) => {
    global.exports["iggy-laptop"].SendAppMessage(
        "boosting",
        "toggleQueue",
        inQueue
    );
});

onNet("iggy-boosting:client:error-expired", () => {
    global.exports["iggy-laptop"].SendNotification(
        "This contract is expired",
        "ERROR"
    );
});

onNet("iggy-boosting:client:error-no-group", () => {
    global.exports["iggy-laptop"].SendNotification(
        "You arent in a group",
        "ERROR"
    );
});

onNet("iggy-boosting:client:error-min-players", () => {
    global.exports["iggy-laptop"].SendNotification(
        "Your group is too small",
        "ERROR"
    );
});

onNet("iggy-boosting:client:error-max-players", () => {
    global.exports["iggy-laptop"].SendNotification(
        "Your group is too big",
        "ERROR"
    );
});

onNet("iggy-boosting:client:error-active", () => {
    global.exports["iggy-laptop"].SendNotification(
        "Your are already doing a contract",
        "ERROR"
    );
});

onNet("iggy-boosting:client:error-busy", () => {
    global.exports["iggy-laptop"].SendNotification(
        "The queue is too busy. Try again later",
        "ERROR"
    );
});

onNet("iggy-boosting:client:error-veh", () => {
    global.exports["iggy-laptop"].SendNotification(
        "Unable to locate vehicle",
        "ERROR"
    );
});

onNet("iggy-boosting:client:error-crypto", () => {
    global.exports["iggy-laptop"].SendNotification(
        "You dont have enough Qbit",
        "ERROR"
    );
});

onNet(
    "iggy-boosting:client:success-started",
    (plate: string, offset: Vector3, contract: ActiveContract) => {
        global.exports["iggy-laptop"].SendNotification(
            `Successfully started contract. Vehicle Plate: ${plate}`,
            "SUCCESS",
            5000
        );

        active = contract;

        blip = AddBlipForRadius(offset.x, offset.y, offset.z, 200);
        SetBlipAlpha(blip, 100);
        SetBlipHighDetail(blip, true);

        global.exports["iggy-laptop"].SendAppMessage(
            "boosting",
            "updateActiveContract",
            contract
        );
    }
);

onNet("lockpicks:UseLockpick", () => {
    if (!active) return;
    let veh = NetworkGetEntityFromNetworkId(active.netId);
    if (!DoesEntityExist(veh)) return;
    let ped = PlayerPedId();
    if (GetVehiclePedIsIn(ped, false) === veh) return;
    let vector4 = active.spawn.vector4;
    let pedCoords = GetEntityCoords(ped, false);

    let dist = CalcDist(
        vector4.x,
        vector4.y,
        vector4.z,
        pedCoords[0],
        pedCoords[1],
        pedCoords[2]
    );
    if (dist <= 2.5) {
        emitNet(
            "police:server:policeAlert",
            `Grand Theft Auto. Plate: ${GetVehicleNumberPlateText(veh)}`
        );
        if (active.class === "C") {
            emitNet("iggy-boosting:server:startDropOff");
            RemoveBlip(blip);
        } else {
            // TODO: TRACKER
            // StartMapBlips();
            emitNet("iggy-boosting:server:started");
        }
    }
});

onNet("iggy-boosting:client:started", () => {
    RemoveBlip(blip);
});

onNet("iggy-boosting:client:dropoffblip", () => {
    let dropoff: Vector3 = active.dropoff.vector3;

    blip = AddBlipForCoord(dropoff.x, dropoff.y, dropoff.z);
    SetBlipSprite(blip, 326);
    SetBlipColour(blip, 2);
    SetBlipScale(blip, 1);

    BeginTextCommandSetBlipName("STRING");
    AddTextComponentSubstringPlayerName("Drop Off Location");
    EndTextCommandSetBlipName(blip);
});

onNet("iggy-boosting:client:emptyVehicle", () => {
    emitNet("qb-phone:server:sendNewMail", {
        sender: "???",
        subject: "Get out and leave the area",
        message: "Well done, get out the vehicle and leave the area",
        button: {},
    });
});

onNet("iggy-boosting:client:finishContract", () => {
    RemoveBlip(blip);
    active = undefined;
    global.exports["iggy-laptop"].SendAppMessage(
        "boosting",
        "updateActiveContract",
        undefined
    );
});

RegisterCommand(
    "iggy-boosting:create",
    () => {
        emitNet("boost:create");
    },
    false
);
