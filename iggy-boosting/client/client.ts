import { Config } from "./../shared/Config";
import { Client } from "qbcore.js";
import { CalcDist, Delay, RandomNumber } from "../shared/utils";
import {
    Contract,
    Group,
    Rep,
    RunningContract,
    Vector3,
    Vehicle,
    VehicleClass,
    vehicleList,
} from "./../shared/types";
import {
    DROP_OFF_LOCATIONS,
    DropOffLocation,
    Location,
    SPAWN_LOCATIONS,
} from "../shared/Locations";

let contracts: Contract[] = [];
let rep: Rep;

interface ActiveContract extends RunningContract {
    dropoffBlip?: number;
    blip?: number;
}
let runningContract: ActiveContract;
let inGroup = false;
let isReady = false;

let request:
    | {
          cid: string;
          name: string;
      }
    | undefined;

let blips: { [key: number]: number } = {};

const QBCore: Client = global.exports["qb-core"].GetCoreObject();

RegisterCommand(
    "iggy-boosting:createContract",
    (source: number, args: string[]) => {
        let model = args[0];
        let hours = args[1] || 0;
        let mins = args[2] || 0;
        let cost = args[3] || 0;
        let reward = args[4] || 0;
        let target = source === 0 ? GetPlayerServerId(PlayerId()) : args[5];

        emitNet(
            "iggy-boosting:server:createContract",
            model,
            hours,
            mins,
            cost,
            reward,
            target
        );
    },
    false
);

RegisterCommand(
    "iggy-boosting:getRep",
    (source: number, args: string[]) => {
        emitNet("iggy-boosting:server:getRep");
    },
    false
);

onNet("iggy-boosting:client:newContract", (contract: Contract) => {
    contracts.push(contract);
    global.exports["iggy-laptop"].SendAppMessage(
        "boosting",
        "newContract",
        contract
    );
});

onNet("iggy-boosting:client:removeContract", (id: number) => {
    global.exports["iggy-laptop"].SendAppMessage(
        "boosting",
        "removeContract",
        id
    );
    contracts = contracts.filter((contract) => contract.id !== id);
});

onNet("iggy-boosting:client:updateRep", (newRep: Rep) => {
    rep = newRep;
    global.exports["iggy-laptop"].SendAppMessage("boosting", "updateRep", rep);
});

onNet("iggy-boosting:client:refuel", (netid: number) => {
    global.exports["LegacyFuel"].SetFuel(
        NetworkGetEntityFromNetworkId(netid),
        100
    );
});

onNet("iggy-boosting:client:error-price", () => {
    global.exports["iggy-laptop"].SendAppMessage("base", "notification", {
        type: "ERROR",
        message: "You dont have enough qbit.",
    });
});

onNet("iggy-boosting:client:error-running", () => {
    global.exports["iggy-laptop"].SendAppMessage("base", "notification", {
        type: "ERROR",
        message: "You are already doing a contract",
    });
});

onNet("iggy-boosting:client:error-busy", () => {
    global.exports["iggy-laptop"].SendAppMessage("base", "notification", {
        type: "ERROR",
        message: "The queue is busy",
    });
});

onNet("iggy-boosting:client:error-expired", () => {
    global.exports["iggy-laptop"].SendAppMessage("base", "notification", {
        type: "ERROR",
        message: "This contract is expired",
    });
});

onNet("iggy-boosting:client:error-veh", () => {
    global.exports["iggy-laptop"].SendAppMessage("base", "notification", {
        type: "ERROR",
        message: "Unable to locate vehicle",
    });
});

onNet("iggy-boosting:client:success-started", (contract: RunningContract) => {
    global.exports["iggy-laptop"].SendAppMessage("base", "notification", {
        type: "SUCCESS",
        message: `Successfully started contract. Vehicle Plate: ${contract.plate}`,
        duration: 5000,
    });
    runningContract = { ...contract };
    let coords = runningContract.location.carLocation;
    runningContract.blip = AddBlipForRadius(
        coords.x + RandomNumber(-100, 100),
        coords.y + RandomNumber(-100, 100),
        coords.z,
        200
    );
    SetBlipAlpha(runningContract.blip, 100);
    SetBlipHighDetail(runningContract.blip, true);

    if (Config.DEBUG) {
        let debugBlip = AddBlipForCoord(coords.x, coords.y, coords.z);
    }

    global.exports["iggy-laptop"].SendAppMessage(
        "boosting",
        "updateActiveContract",
        runningContract
    );
});

onNet("iggy-boosting:client:openHack", () => {
    if (!runningContract) return;

    let veh = NetworkGetEntityFromNetworkId(runningContract.vehicle);
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

onNet("lockpicks:UseLockpick", () => {
    if (!runningContract) return;
    let veh = NetworkGetEntityFromNetworkId(runningContract.vehicle);
    if (!DoesEntityExist(veh)) return;
    let ped = PlayerPedId();
    if (GetVehiclePedIsIn(ped, false) === veh) return;
    let carCoords = runningContract.location.carLocation;
    let pedCoords = GetEntityCoords(ped, false);

    let dist = CalcDist(
        carCoords.x,
        carCoords.y,
        carCoords.z,
        pedCoords[0],
        pedCoords[1],
        pedCoords[2]
    );
    if (dist <= 2.5) {
        emitNet(
            "police:server:policeAlert",
            `Grand Theft Auto. Plate: ${GetVehicleNumberPlateText(veh)}`
        );
        StartMapBlips();
        emitNet("iggy-boosting:server:started");
        RemoveBlip(runningContract.blip);
    }
});

onNet("iggy-boosting:client:refreshGroups", (groups: Group[]) => {
    global.exports["iggy-laptop"].SendAppMessage(
        "boosting",
        "updateGroups",
        groups
    );
});

onNet("iggy-boosting:client:acceptedRequest", () => {
    global.exports["iggy-laptop"].SendAppMessage("boosting", "joinedGroup");
    inGroup = true;
});

onNet("iggy-boosting:client:requestAccepted", () => {
    request = undefined;
});

onNet("iggy-boosting:client:requestGroup", (cid: string, name: string) => {
    request = {
        cid: cid,
        name: name,
    };
    global.exports["iggy-laptop"].SendAppMessage("boosting", "requestJoin", {
        cid: cid,
        name: name,
    });
});

onNet("iggy-boosting:client:started", () => {
    RemoveBlip(runningContract.blip);
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

onNet("iggy-boosting:client:dropoffblip", async (host: boolean) => {
    let dropoff: Vector3 = runningContract.dropoff.location;

    runningContract.dropoffBlip = AddBlipForCoord(
        dropoff.x,
        dropoff.y,
        dropoff.z
    );

    SetBlipSprite(runningContract.dropoffBlip, 326);
    SetBlipColour(runningContract.dropoffBlip, 2);
    SetBlipScale(runningContract.dropoffBlip, 1);

    BeginTextCommandSetBlipName("STRING");
    AddTextComponentSubstringPlayerName("Drop Off Locations");
    EndTextCommandSetBlipName(runningContract.dropoffBlip);
});

onNet("iggy-boosting:client:finishContract", () => {
    RemoveBlip(runningContract.dropoffBlip);
    runningContract = undefined;
});

onNet("iggy-boosting:client:emptyVehicle", () => {
    emitNet("qb-phone:server:sendNewMail", {
        sender: "???",
        subject: "Get out and leave the area",
        message: "Well done, get out the vehicle and leave the area",
        button: {},
    });
});

global.exports["iggy-laptop"].RegisterLaptopCallback("boosting:getRep", () => {
    return rep;
});

// boosting:getContracts
global.exports["iggy-laptop"].RegisterLaptopCallback(
    "boosting:getContracts",
    () => {
        return { contracts: contracts, active: runningContract };
    }
);

// boosting:acceptContract
global.exports["iggy-laptop"].RegisterLaptopCallback(
    "boosting:acceptContract",
    (id: number) => {
        emitNet("iggy-boosting:server:acceptContract", id);
    }
);

// boosting:hackComplete
global.exports["iggy-laptop"].RegisterLaptopCallback(
    "boosting:hackComplete",
    () => {
        global.exports["iggy-laptop"].SetFocus(false, false);
        emitNet("iggy-boosting:server:hackComplete", runningContract.vehicle);

        let ent = Entity(
            NetworkGetEntityFromNetworkId(runningContract.vehicle)
        );
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

// boosting:hackFailed
global.exports["iggy-laptop"].RegisterLaptopCallback(
    "boosting:hackFailed",
    () => {
        global.exports["iggy-laptop"].SetFocus(false, false);

        emitNet("iggy-boosting:server:hackFailed", runningContract.vehicle);
        let veh = NetworkGetEntityFromNetworkId(runningContract.vehicle);
        let failed = Entity(veh).state.hacks.failed + 1;

        if (failed === 5) {
            emitNet(
                "iggy-boosting:server:disableVehicle",
                runningContract.vehicle
            );
        }
    }
);

// boosting:createGroup
global.exports["iggy-laptop"].RegisterLaptopCallback(
    "boosting:createGroup",
    () => {
        emitNet(
            "iggy-boosting:server:createGroup",
            QBCore.Functions.GetPlayerData().citizenid,
            QBCore.Functions.GetPlayerData().charinfo.firstname +
                " " +
                QBCore.Functions.GetPlayerData().charinfo.lastname
        );
        inGroup = true;
    }
);

// boosting:requestGroup
global.exports["iggy-laptop"].RegisterLaptopCallback(
    "boosting:requestGroup",
    (groupId: number) => {
        emitNet(
            "iggy-boosting:server:requestGroup",
            groupId,
            QBCore.Functions.GetPlayerData().citizenid,
            QBCore.Functions.GetPlayerData().charinfo.firstname +
                " " +
                QBCore.Functions.GetPlayerData().charinfo.lastname
        );
    }
);

// boosting:acceptRequest
global.exports["iggy-laptop"].RegisterLaptopCallback(
    "boosting:acceptRequest",
    (citizenid: string) => {
        emitNet(
            "iggy-boosting:server:acceptRequest",
            citizenid,
            QBCore.Functions.GetPlayerData().citizenid
        );
    }
);

// boosting:denyRequest
global.exports["iggy-laptop"].RegisterLaptopCallback(
    "boosting:denyRequest",
    () => {
        request = undefined;
    }
);

// boosting:getGroups
global.exports["iggy-laptop"].RegisterLaptopCallback(
    "boosting:getGroups",
    () => {
        emitNet("iggy-boosting:server:getGroups");
        return { inGroup: inGroup, request: request, isReady: isReady };
    }
);

// boosting:leaveGroup
global.exports["iggy-laptop"].RegisterLaptopCallback(
    "boosting:leaveGroup",
    () => {
        inGroup = false;
        emitNet("iggy-boosting:server:leaveGroup");
    }
);

// boosting:toggleReady
global.exports["iggy-laptop"].RegisterLaptopCallback(
    "boosting:toggleReady",
    (ready: boolean) => {
        isReady = ready;
        emitNet("iggy-boosting:server:toggleReady", ready);
    }
);

onNet("QBCore:Client:OnPlayerLoaded", () => {
    emitNet("iggy-boosting:server:getRep");
});

async function StartMapBlips() {
    let veh = NetworkGetEntityFromNetworkId(runningContract.vehicle);
    let hacks = Entity(veh).state.hacks;
    while (hacks.remaining > 0) {
        if (!DoesEntityExist(veh)) {
            break;
        }

        let coords = GetEntityCoords(veh, true);

        emitNet(
            "iggy-boosting:server:updateBlip",
            coords,
            runningContract.vehicle
        );

        await Delay((Config.DEFAULT_BLIP_DELAY * 1000) / hacks.remaining);
        hacks = Entity(veh).state.hacks;
    }
}

// iggy-boosting:client:createBlip
onNet(
    "iggy-boosting:client:createBlip",
    (coords: number[], vehNetId: number) => {
        let name = QBCore.Functions.GetPlayerData().job.name;
        let duty = QBCore.Functions.GetPlayerData().job.onduty;

        if (name !== Config.POLICE_JOB) {
            return;
        }
        if (!duty) {
            return;
        }

        if (blips[vehNetId]) RemoveBlip(blips[vehNetId]);

        blips[vehNetId] = AddBlipForCoord(coords[0], coords[1], coords[2]);
        SetBlipSprite(blips[vehNetId], 326);
        SetBlipColour(blips[vehNetId], 1);
        SetBlipFlashes(blips[vehNetId], true);
        SetBlipScale(blips[vehNetId], 2);

        BeginTextCommandSetBlipName("STRING");
        AddTextComponentSubstringPlayerName("Grand Theft Auto Tracker");
        EndTextCommandSetBlipName(blips[vehNetId]);
    }
);

RegisterCommand(
    "iggy-boosting:coords",
    () => {
        let coords = GetEntityCoords(PlayerPedId(), true);
        let w = GetEntityHeading(PlayerPedId());
        emitNet("coords", { x: coords[0], y: coords[1], z: coords[2], w: w });
    },
    false
);

RegisterCommand(
    "iggy-boosting:debug",
    async (source: string, args: string[]) => {
        // let vehClass = "C";
        if (args[0] === "SPAWN") {
            let CLocations: Location[] = SPAWN_LOCATIONS["C"];
            let BLocations: Location[] = SPAWN_LOCATIONS["B"];
            let locations: Location[] = CLocations.concat(BLocations);
            locations.forEach((location, index) => {
                let coords = location.carLocation;
                let blip = AddBlipForCoord(coords.x, coords.y, coords.z);
                SetBlipColour(blip, 2);
                locations.forEach((l, i) => {
                    if (index !== i) {
                        let c = l.carLocation;
                        let dist = CalcDist(
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
                await Delay(10);
                locations.forEach((location, index) => {
                    let coords = location.carLocation;
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
                let coords = location.location;
                let blip = AddBlipForCoord(coords.x, coords.y, coords.z);
                SetBlipColour(blip, 2);
                locations.forEach((l, i) => {
                    if (index !== i) {
                        let c = l.location;
                        let dist = CalcDist(
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
                await Delay(10);
                locations.forEach((location, index) => {
                    let coords = location.location;
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
let debug: Location[] = [];
RegisterCommand(
    "iggy-boosting:debug:addLocation",
    async (source: string, args: string[]) => {
        let coords = GetEntityCoords(PlayerPedId(), true);
        let w = GetEntityHeading(PlayerPedId());
        let newLocation: Location = {
            carLocation: { x: coords[0], y: coords[1], z: coords[2], w: w },
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
            location: { x: coords[0], y: coords[1], z: coords[2] },
            inUse: false,
        };
        debug2.push(newLocation);
        emitNet("coords", debug2);
    },
    false
);
let debug3: vehicleList = {};

RegisterCommand(
    "iggy-boosting:debug:addCar",
    (source: string, args: string[]) => {
        let veh = QBCore.Shared.Vehicles[args[0]];
        let vehClass = args[1] as VehicleClass;
        let newVeh: Vehicle = {
            model: veh.model,
            name: veh.name,
            class: vehClass,
        };
        debug3[veh.model] = newVeh;
        emitNet("coords", debug3);
    },
    false
);
