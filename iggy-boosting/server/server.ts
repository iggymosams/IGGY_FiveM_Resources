import { Config } from "./../shared/Config";
import {
    DROP_OFF_LOCATIONS,
    DropOffLocation,
    Location,
    SPAWN_LOCATIONS,
} from "./../shared/Locations";
import { Player, Server } from "qbcore.js";
import { VEHICLES } from "./../shared/Vehicles";
import {
    Contract,
    Group,
    Rep,
    RunningContract,
    VehicleClass,
} from "./../shared/types";
import { CalcDist, Delay, RandomNumber } from "./../shared/utils";
import { GetRep, GiveRep } from "./exports";
import {
    CreateContract,
    DeleteContract,
    FindContractById,
    GenerateContract,
} from "./ContractManager";
import { generateTime } from "./ContractUtils";

const QBCore: Server = global.exports["qb-core"].GetCoreObject();

let groups: Group[] = [];
let runningContracts: { [key: number]: RunningContract } = {};

let currentGroupId = 1;

let queue: string[] = [];

// iggy-boosting:server:createContract
onNet(
    "iggy-boosting:server:createContract",
    (
        model: string,
        hours: string,
        mins: string,
        cost: number,
        reward: number,
        target: number
    ) => {
        let player = QBCore.Functions.GetPlayer(target);

        let vehicle = VEHICLES[model];
        if (!vehicle) {
            GenerateContract(player.PlayerData.citizenid, target);
        } else {
            let hr = +hours;
            let min = +mins;
            let rewardCrypto = Math.floor(cost * RandomNumber(1, 3));
            CreateContract(
                vehicle.class,
                model,
                vehicle.name,
                reward,
                cost,
                rewardCrypto,
                generateTime(hr, min),
                target
            );
        }
    }
);

onNet("iggy-boosting:server:getRep", async () => {
    let src = source;
    let player = QBCore.Functions.GetPlayer(src);
    let rep: Rep = await GetRep(player.PlayerData.citizenid);
    console.log(src, rep);
    emitNet("iggy-boosting:client:updateRep", src, rep);
});

onNet("iggy-boosting:server:acceptContract", async (id: number) => {
    let src: number = source;
    let contract = FindContractById(id);

    let player = QBCore.Functions.GetPlayer(src);
    let cid = player.PlayerData.citizenid;
    let group = findGroupByPlayer(cid);

    if (Date.now() / 1000 > contract.time) {
        emitNet("iggy-boosting:client:error-expired", src);
        DeleteContract(src, id);
        return;
    }

    if (runningContracts[group.id]) {
        emitNet("iggy-boosting:client:error-running", src);
        return;
    }

    if (player.PlayerData.money.crypto < contract.cost) {
        emitNet("iggy-boosting:client:error-price", src);
        return;
    }

    let location = getLocation(contract.class, 0);
    let dropoff = getDropOff(0);

    if (!location || !dropoff) {
        emitNet("iggy-boosting:client:error-busy", src);
        return;
    }

    let running: RunningContract = {
        id: contract.id,
        location: location,
        model: contract.model,
        contract: contract,
        class: contract.class,
        dropoff: dropoff,
        hacksFailed: 0,
    };

    runningContracts[group.id] = running;

    let spawned = await spawnVeh(src);
    if (!spawned) {
        runningContracts[group.id] = undefined;
        emitNet("iggy-boosting:client:error-veh", src);
        return;
    } else {
        let leader = QBCore.Functions.GetPlayerByCitizenId(group.leaderCid);
        player.Functions.RemoveMoney("crypto", contract.cost, "Started Boost");
        emitNet(
            "iggy-boosting:client:success-started",
            leader.PlayerData.source,
            runningContracts[group.id]
        );
        group.players.forEach((playerCid) => {
            let plr = QBCore.Functions.GetPlayerByCitizenId(playerCid);
            emitNet(
                "iggy-boosting:client:success-started",
                plr.PlayerData.source,
                runningContracts[group.id]
            );
        });

        DeleteContract(src, id);
    }
});

// iggy-boosting:server:updateBlip
onNet(
    "iggy-boosting:server:updateBlip",
    (coords: number[], vehNetId: number) => {
        emitNet("iggy-boosting:client:createBlip", -1, coords, vehNetId);
    }
);

onNet("iggy-boosting:server:hackComplete", async (netId: number) => {
    let ent = Entity(NetworkGetEntityFromNetworkId(netId));
    let state = ent.state.hacks;
    let date = new Date();
    date.setSeconds(date.getSeconds() + Config.HACK_COOLDOWN);
    ent.state.set(
        "hacks",
        {
            failed: state.failed,
            remaining: state.remaining - 1,
            cooldown: Math.floor(date.getTime() / 1000),
        },
        true
    );

    if (state.remaining - 1 === 0) {
        let src: number = source;

        let player = QBCore.Functions.GetPlayer(src);
        let cid = player.PlayerData.citizenid;
        let group = findGroupByPlayer(cid);

        let leader = QBCore.Functions.GetPlayerByCitizenId(group.leaderCid);
        emitNet(
            "iggy-boosting:client:dropoffblip",
            leader.PlayerData.source,
            true
        );
        group.players.forEach((playerCid) => {
            let plr = QBCore.Functions.GetPlayerByCitizenId(playerCid);
            emitNet(
                "iggy-boosting:client:dropoffblip",
                plr.PlayerData.source,
                false
            );
        });
        let runningContract = runningContracts[group.id];
        let veh = NetworkGetEntityFromNetworkId(runningContract.vehicle);
        let dropoff = runningContract.dropoff.location;

        let dropped = false;

        while (!dropped) {
            await Delay(500);
            let coords = GetEntityCoords(veh);
            let dist = CalcDist(
                coords[0],
                coords[1],
                coords[2],
                dropoff.x,
                dropoff.y,
                dropoff.z
            );
            if (dist <= 25) {
                dropped = true;
            }
        }
        emitNet("iggy-boosting:client:emptyVehicle", leader.PlayerData.source);

        let empty: boolean = false;
        while (!empty) {
            let seats = 8;
            let emptySeats = [];
            for (let i = -1; i < 8 - 1; i++) {
                if (GetPedInVehicleSeat(veh, i) === 0) {
                    emptySeats.push(i);
                }
            }
            if (emptySeats.length === seats) {
                empty = true;
            }
            await Delay(50);
        }

        await Delay(5000);
        DeleteEntity(veh);
        let players: string[] = [group.leaderCid, ...group.players.concat()];

        players.forEach((playerCid) => {
            let plr = QBCore.Functions.GetPlayerByCitizenId(playerCid);
            GiveRep(playerCid, runningContract.contract.rewardRep);
            plr.Functions.AddMoney(
                "crypto",
                runningContract.contract.rewardCrypto
            );
            emitNet(
                "iggy-boosting:client:finishContract",
                plr.PlayerData.source
            );
        });

        runningContracts[group.id] = undefined;
    }
});

onNet("iggy-boosting:server:hackFailed", (netId: number) => {
    let ent = Entity(NetworkGetEntityFromNetworkId(netId));
    let state = ent.state.hacks;
    let date = new Date();
    date.setSeconds(date.getSeconds() + Config.HACK_COOLDOWN);
    ent.state.set(
        "hacks",
        {
            failed: state.failed + 1,
            remaining: state.remaining,
            cooldown: Math.floor(date.getTime() / 1000),
        },
        true
    );
});

onNet("iggy-boosting:server:createGroup", (cid: string, name: string) => {
    let group: Group = {
        id: currentGroupId,
        leaderCid: cid,
        leaderName: name,
        players: [],
        maxSlots: 2,
    };
    currentGroupId++;
    groups = [...groups, group];
    emitNet("iggy-boosting:client:refreshGroups", -1, groups);
});

// iggy-boosting:server:requestGroup
onNet(
    "iggy-boosting:server:requestGroup",
    (id: number, cid: string, name: string) => {
        let group: Group = findGroupById(id);
        let leader = QBCore.Functions.GetPlayerByCitizenId(group.leaderCid);
        emitNet(
            "iggy-boosting:client:requestGroup",
            leader.PlayerData.source,
            cid,
            name
        );
    }
);

// iggy-boosting:server:acceptRequest
onNet(
    "iggy-boosting:server:acceptRequest",
    (cid: string, leaderCid: string) => {
        let group: Group = findGroupByLeader(leaderCid);
        group.players = [...group.players, cid];
        let plr = QBCore.Functions.GetPlayerByCitizenId(cid);
        let leaderPlr = QBCore.Functions.GetPlayerByCitizenId(leaderCid);
        emitNet("iggy-boosting:client:acceptedRequest", plr.PlayerData.source);
        emitNet(
            "iggy-boosting:client:requestAccepted",
            leaderPlr.PlayerData.source
        );
        emitNet("iggy-boosting:client:refreshGroups", -1, groups);
    }
);

onNet("iggy-boosting:server:getGroups", () => {
    emitNet("iggy-boosting:client:refreshGroups", source, groups);
});

onNet("iggy-boosting:server:started", () => {
    let src: number = source;
    let player = QBCore.Functions.GetPlayer(src);
    let cid = player.PlayerData.citizenid;
    let group = findGroupByPlayer(cid);

    let leader = QBCore.Functions.GetPlayerByCitizenId(group.leaderCid);
    emitNet(
        "iggy-boosting:client:started",
        leader.PlayerData.source,
        runningContracts[group.id]
    );
    group.players.forEach((playerCid) => {
        let plr = QBCore.Functions.GetPlayerByCitizenId(playerCid);
        emitNet(
            "iggy-boosting:client:started",
            plr.PlayerData.source,
            runningContracts[group.id]
        );
    });
});

onNet("iggy-boosting:server:disableVehicle", (netid: number) => {
    emitNet("iggy-boosting:client:disableVehicle", -1, netid);
});

onNet("iggy-boosting:server:leaveGroup", () => {
    let src: number = source;

    let plr = QBCore.Functions.GetPlayer(src);
    let group: Group = findGroupByPlayer(plr.PlayerData.citizenid);
    if (group.leaderCid === plr.PlayerData.citizenid) {
        if (group.players.length > 0) {
            group.leaderCid = group.players[0];
            let newLeader = QBCore.Functions.GetPlayerByCitizenId(
                group.leaderCid
            );
            group.leaderName =
                newLeader.PlayerData.charinfo.firstname +
                " " +
                newLeader.PlayerData.charinfo.lastname;
            group.players = group.players.filter(
                (player) => player !== group.leaderCid
            );
        } else {
            groups = groups.filter((g) => g.id !== group.id);
        }
    } else {
        group.players = group.players.filter(
            (player) => player !== plr.PlayerData.citizenid
        );
    }
    emitNet("iggy-boosting:client:refreshGroups", source, groups);
});

onNet("iggy-boosting:server:toggleReady", (ready: boolean) => {
    let src: number = source;

    let plr = QBCore.Functions.GetPlayer(src);

    if (ready) {
        queue.push(plr.PlayerData.citizenid);
    } else {
        queue = queue.filter((cid) => {
            cid !== plr.PlayerData.citizenid;
        });
    }
});

function findGroupByPlayer(cid: string): Group {
    return groups.find((group) => {
        return group.players.includes(cid) || group.leaderCid === cid;
    });
}

function findGroupByLeader(cid: string): Group {
    return groups.find((group) => group.leaderCid === cid);
}

function findGroupById(id: number): Group {
    return groups.find((group) => group.id === id);
}

function getDropOff(i: number): DropOffLocation {
    if (i >= 10) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * DROP_OFF_LOCATIONS.length);
    let location = DROP_OFF_LOCATIONS[randomIndex];
    if (location.inUse) {
        return getDropOff(i + 1);
    }

    location.inUse = true;
    return location;
}

function getLocation(vehClass: VehicleClass, i: number): Location {
    if (i >= 10) {
        return null;
    }

    let locations = SPAWN_LOCATIONS[vehClass];
    const randomIndex = Math.floor(Math.random() * locations.length);
    let location = locations[randomIndex];

    if (location.inUse) {
        return getLocation(vehClass, i + 1);
    }

    location.inUse = true;
    return location;
}

// TODO: ADD MAX CONTRACTS PER PLAYER AND ACTIVE PER CLASS AND RESTART
async function ContractLoop() {
    while (true) {
        await Delay(Config.TIME_BETWEEN_CONTRACTS * 1000);
        if (queue.length > 0) {
            let chance = Math.random();

            if (chance >= Config.CONTRACT_CHANCE / 100) {
                continue;
            }

            let player: Player = getRandomPlayer();

            GenerateContract(
                player.PlayerData.citizenid,
                player.PlayerData.source
            );
        }
    }
}
ContractLoop();

function getRandomPlayer(): Player {
    const random = Math.floor(Math.random() * queue.length);
    return QBCore.Functions.GetPlayerByCitizenId(queue[random]);
}

function getHacksFromClass(vehClass: VehicleClass): number {
    switch (vehClass) {
        case "A":
            return 20;
        case "B":
            return 10;
        case "C":
            return 5;
        default:
            break;
    }
}

async function spawnVeh(src: number) {
    let player = QBCore.Functions.GetPlayer(src);
    let cid = player.PlayerData.citizenid;
    let group = findGroupByPlayer(cid);

    let model = runningContracts[group.id].model;
    let coords = runningContracts[group.id].location.carLocation;
    let hash = GetHashKey(model);

    let veh = CreateVehicle(
        hash,
        coords.x,
        coords.y,
        coords.z,
        coords.w,
        true,
        false
    );

    let checks = 0;
    while (!DoesEntityExist(veh)) {
        if (checks == 10) {
            break;
        }
        await Delay(10);
        checks++;
    }
    if (!DoesEntityExist(veh)) return false;

    SetVehicleDoorsLocked(veh, 2);
    let netid = NetworkGetNetworkIdFromEntity(veh);
    let plate = GetVehicleNumberPlateText(veh);

    runningContracts[group.id].plate = plate;
    runningContracts[group.id].vehicle = netid;

    Entity(veh).state.hacks = {
        remaining: getHacksFromClass(runningContracts[group.id].class),
        failed: 0,
        cooldown: Math.floor(new Date().getTime() / 1000),
    };
    emitNet("iggy-boosting:client:refuel", -1, netid);
    return true;
}

QBCore.Functions.CreateUseableItem("electronickit", (src, item) => {
    emitNet("iggy-boosting:client:openHack", src);
});

onNet("coords", (coords: any) => {
    console.log(JSON.stringify(coords), "\n\n\n\n\n\n");
});
