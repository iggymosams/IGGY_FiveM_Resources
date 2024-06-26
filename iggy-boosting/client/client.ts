import { Client } from "@zerio2/qbcore.js";
import {
    ActiveContract,
    Contract,
    DropOffLocation,
    Rep,
    SpawnLocation,
    Vector3,
} from "../shared/types";
import { Config } from "../shared/Config";
import { SPAWN_LOCATIONS, DROP_OFF_LOCATIONS } from "../shared/locations";

let active: ActiveContract;
let blip: number;
let pdTrackers: { [key: number]: number } = {};

const QBCore: Client = global.exports["qb-core"].GetCoreObject();

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "boosting:getInfo",
    async () => {
        emitNet("iggy-boosting:server:getInfo");

        global.exports["iggy-laptop"].SendAppMessage(
            "boosting",
            "updateActiveContract",
            active
        );
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

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "boosting:hackFailed",
    async () => {
        global.exports["iggy-laptop"].SetFocus(false, false);
        emitNet("iggy-boosting:server:hackFailed", active.netId, active.class);
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "boosting:hackComplete",
    async () => {
        global.exports["iggy-laptop"].SetFocus(false, false);
        emitNet("iggy-boosting:server:hackComplete", active.netId);
        let ent = Entity(NetworkGetEntityFromNetworkId(active.netId));
        let state = ent.state.hacks;
        if (state.remaining - 1 === 0) {
            emitNet("qb-phone:server:sendNewMail", {
                sender: "???",
                subject: "Hacks Complete",
                message: "Hacks Comeplete. Head to the drop off location",
                button: {},
            });
        }
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

    let dist = global.exports["iggy-utils"].CalcDist(
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

onNet("iggy-boosting:client:openHack", () => {
    if (!active) return;

    let veh = NetworkGetEntityFromNetworkId(active.netId);
    if (!DoesEntityExist(veh)) return;

    let ped = PlayerPedId();

    if (!IsPedInVehicle(ped, veh, false) && !GetIsVehicleEngineRunning(veh))
        return;

    if (GetPedInVehicleSeat(veh, -1) === ped) return;

    let state = Entity(veh).state;
    let cooldown = state.hacks.cooldown;
    let remaining = state.hacks.remaining;
    if (remaining === 0) return;
    if (Date.now() / 1000 < cooldown) {
        QBCore.Functions.Notify("You cant do this yet");
        return;
    }

    global.exports["iggy-laptop"].SendAppMessage("hack", "setVisible", {
        open: true,
        difficulty: 1,
    });

    global.exports["iggy-laptop"].SetFocus(true, true);
});

onNet("iggy-boosting:client:disableVehicle", (netid: number) => {
    let veh = NetworkGetEntityFromNetworkId(netid);
    for (let i = 0; i < 7; i++) {
        SetVehicleTyreBurst(veh, i, true, 1000.0);
    }
    global.exports["LegacyFuel"].SetFuel(
        NetworkGetEntityFromNetworkId(netid),
        0
    );
});

onNet("iggy-boosting:client:refuel", (netid: number) => {
    global.exports["LegacyFuel"].SetFuel(
        NetworkGetEntityFromNetworkId(netid),
        100
    );
});

onNet("iggy-boosting:client:createBlip", (coords: number[], netId: number) => {
    let name = QBCore.Functions.GetPlayerData().job.name;
    let duty = QBCore.Functions.GetPlayerData().job.onduty;

    if (name !== Config.POLICE_JOB) {
        return;
    }

    if (!duty) {
        return;
    }

    if (pdTrackers[netId]) RemoveBlip(pdTrackers[netId]);

    let blip = AddBlipForCoord(coords[0], coords[1], coords[2]);
    SetBlipSprite(blip, 326);
    SetBlipColour(blip, 1);
    SetBlipFlashes(blip, true);
    SetBlipScale(blip, 2);

    BeginTextCommandSetBlipName("STRING");
    AddTextComponentSubstringPlayerName("Grand Theft Auto Tracker");
    EndTextCommandSetBlipName(blip);

    pdTrackers[netId] = blip;
});

onNet("iggy-boosting:client:removeBlip", (netId: number) => {
    let name = QBCore.Functions.GetPlayerData().job.name;
    let duty = QBCore.Functions.GetPlayerData().job.onduty;

    if (name !== Config.POLICE_JOB) {
        return;
    }
    if (!duty) {
        return;
    }

    if (pdTrackers[netId]) RemoveBlip(pdTrackers[netId]);
});

onNet("QBCore:Client:OnPlayerUnload", () => {
    emit("iggy-boosting:client:playerLeft");
});

onNet("iggy-boosting:client:playerLeft", () => {
    global.exports["iggy-laptop"].SendAppMessage("base", "restart");
    global.exports["iggy-laptop"].SetFocus(false, false);

    active = undefined;
    if (blip) RemoveBlip(blip);
    blip = undefined;

    Object.values(pdTrackers).forEach((blip) => {
        RemoveBlip(blip);
    });
    pdTrackers = {};
    emitNet("iggy-boosting:server:toggleQueue", true);
});

let debug: SpawnLocation[] = [];
RegisterCommand(
    "iggy-boosting:debug:addLocation",
    async (source: string, args: string[]) => {
        let coords = GetEntityCoords(PlayerPedId(), true);
        let w = GetEntityHeading(PlayerPedId());
        let newLocation: SpawnLocation = {
            vector4: { x: coords[0], y: coords[1], z: coords[2], w: w },
            inUse: false,
        };
        debug.push(newLocation);
        emitNet("coords", debug);
    },
    false
);

let debug2: DropOffLocation[] = [];
RegisterCommand(
    "iggy-boosting:debug:addDropLocation",
    async (source: string, args: string[]) => {
        let coords = GetEntityCoords(PlayerPedId(), true);
        let w = GetEntityHeading(PlayerPedId());
        let newLocation: DropOffLocation = {
            vector3: { x: coords[0], y: coords[1], z: coords[2] },
            inUse: false,
        };
        debug2.push(newLocation);
        emitNet("coords", debug2);
    },
    false
);

RegisterCommand(
    "iggy-boosting:debug",
    async (source: string, args: string[]) => {
        // let vehClass = "C";
        if (args[0] === "SPAWN") {
            let CLocations: SpawnLocation[] = SPAWN_LOCATIONS["C"];
            let BLocations: SpawnLocation[] = SPAWN_LOCATIONS["B"];
            let locations: SpawnLocation[] = CLocations.concat(BLocations);
            locations.forEach((location, index) => {
                let coords = location.vector4;
                let blip = AddBlipForCoord(coords.x, coords.y, coords.z);
                SetBlipColour(blip, 2);
                locations.forEach((l, i) => {
                    if (index !== i) {
                        let c = l.vector4;
                        let dist = global.exports["iggy-utils"].CalcDist(
                            coords.x,
                            coords.y,
                            coords.z,
                            c.x,
                            c.y,
                            c.z
                        );
                        if (dist <= 5) {
                            console.log(
                                "found",
                                dist,
                                i,
                                coords.x,
                                coords.y,
                                coords.z,
                                c.x,
                                c.y,
                                c.z
                            );
                            SetBlipColour(blip, 1);
                        }
                    }
                });
            });
            while (true) {
                await global.exports["iggy-utils"].Delay(10);
                locations.forEach((location, index) => {
                    let coords = location.vector4;
                    DrawMarker(
                        0,
                        // COORDS
                        coords.x,
                        coords.y,
                        coords.z,
                        //DIR
                        0.0,
                        0.0,
                        0.0,
                        //ROT
                        0.0,
                        0.0,
                        0.0,
                        //SCALE
                        0.5,
                        0.5,
                        0.5,
                        120,
                        10,
                        20,
                        155,
                        false,
                        false,
                        0,
                        false,
                        null,
                        null,
                        false
                    );
                });
            }
        } else if (args[0] === "DROP") {
            let locations: DropOffLocation[] = DROP_OFF_LOCATIONS;
            locations.forEach((location, index) => {
                let coords = location.vector3;
                let blip = AddBlipForCoord(coords.x, coords.y, coords.z);
                SetBlipColour(blip, 2);
                locations.forEach((l, i) => {
                    if (index !== i) {
                        let c = l.vector3;
                        let dist = global.exports["iggy-utils"].CalcDist(
                            coords.x,
                            coords.y,
                            coords.z,
                            c.x,
                            c.y,
                            c.z
                        );
                        if (dist <= 5) {
                            console.log(
                                "found",
                                dist,
                                i,
                                coords.x,
                                coords.y,
                                coords.z,
                                c.x,
                                c.y,
                                c.z
                            );
                            SetBlipColour(blip, 1);
                        }
                    }
                });
            });
            while (true) {
                await global.exports["iggy-utils"].Delay(10);
                locations.forEach((location, index) => {
                    let coords = location.vector3;
                    DrawMarker(
                        0,
                        // COORDS
                        coords.x,
                        coords.y,
                        coords.z,
                        //DIR
                        0.0,
                        0.0,
                        0.0,
                        //ROT
                        0.0,
                        0.0,
                        0.0,
                        //SCALE
                        0.5,
                        0.5,
                        0.5,
                        120,
                        10,
                        20,
                        155,
                        false,
                        false,
                        0,
                        false,
                        null,
                        null,
                        false
                    );
                });
            }
        }
    },
    false
);
