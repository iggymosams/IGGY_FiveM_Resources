import { Player, Server } from "@zerio2/qbcore.js";
import { GetRep, GiveRep } from "./RepDatabase";
import {
    ActiveContract,
    Contract,
    DropOffLocation,
    Rep,
    SpawnLocation,
    Vector3,
    Vector4,
    VehicleClass,
    VehicleList,
} from "../shared/types";
import { DROP_OFF_LOCATIONS, SPAWN_LOCATIONS } from "../shared/locations";
import { VEHICLES } from "../shared/vehicles";
import { Group } from "./../../iggy-groups/shared/types";
import { Config } from "../shared/Config";

const QBCore: Server = global.exports["qb-core"].GetCoreObject();

let contracts: Record<string, Contract[]> = {};
let activeGroupContracts: Map<number, ActiveContract> = new Map();
let activeSoloContracts: Map<string, ActiveContract> = new Map();
let currentId: number = 1;

let queue: number[] = [];

function CreateContract(
    vehClass: VehicleClass,
    name: string,
    model: string,
    rewardRep: number,
    cost: number,
    rewardCrypto: number,
    time: number,
    target: number
) {
    let contract: Contract = {
        class: vehClass,
        name: name,
        model: model,
        cost: cost,
        rewardRep: rewardRep,
        rewardCrypto: rewardCrypto,
        time: time,
        id: currentId,
    };
    currentId++;

    let player = QBCore.Functions.GetPlayer(target);
    let cid = player.PlayerData.citizenid;
    contracts[cid].push(contract);

    emitNet("iggy-boosting:client:updateContracts", target, contracts[cid]);
}

function DeleteContract(src: number, id: number) {
    let player = QBCore.Functions.GetPlayer(src);
    let cid = player.PlayerData.citizenid;
    contracts[cid] = contracts[cid].filter((c) => c.id !== id);
    emitNet("iggy-boosting:client:updateContracts", src, contracts[cid]);
}

function getMinMaxPlayers(vehClass: VehicleClass) {
    return Config.MAX_PLAYERS[vehClass];
}

function getLocation(vehClass: VehicleClass, i = 0): SpawnLocation {
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

function getDropOff(i = 0): DropOffLocation {
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

function getHacksFromClass(vehClass: VehicleClass): number {
    return Config.HACKS[vehClass];
}

function getFailsFromClass(vehClass: VehicleClass): number {
    return Config.MAX_FAILED[vehClass];
}

async function spawnVehicle(
    model: string,
    vector4: Vector4,
    vehClass: VehicleClass
) {
    let hash = GetHashKey(model);

    let veh = CreateVehicle(
        hash,
        vector4.x,
        vector4.y,
        vector4.z,
        vector4.w,
        true,
        false
    );

    let checks = 0;
    while (!DoesEntityExist(veh)) {
        if (checks == 10) {
            break;
        }
        await global.exports["iggy-utils"].Delay(10);
        checks++;
    }
    if (!DoesEntityExist(veh)) return {};

    SetVehicleDoorsLocked(veh, 2);
    let netid = NetworkGetNetworkIdFromEntity(veh);
    let plate = GetVehicleNumberPlateText(veh);

    Entity(veh).state.hacks = {
        remaining: getHacksFromClass(vehClass),
        failed: 0,
        cooldown: Math.floor(new Date().getTime() / 1000),
    };
    emitNet("iggy-boosting:client:refuel", -1, netid);
    return { netid, plate };
}

function getPlayerContract(src: number): ActiveContract {
    let player = QBCore.Functions.GetPlayer(src);
    let cid = player.PlayerData.citizenid;
    let group: Group = global.exports["iggy-groups"].GetPlayerGroup(cid);

    let active: ActiveContract;

    if (group !== null) {
        active = activeGroupContracts.get(group.id);
    } else {
        active = activeSoloContracts.get(cid);
    }
    return active;
}

async function beginDropOff(src: number) {
    let player = QBCore.Functions.GetPlayer(src);
    let cid = player.PlayerData.citizenid;
    let group: Group = global.exports["iggy-groups"].GetPlayerGroup(cid);

    let active: ActiveContract;
    let leader: number;
    if (group !== null) {
        global.exports["iggy-groups"].GroupEmitNet(
            group.id,
            "iggy-boosting:client:dropoffblip"
        );
        active = activeGroupContracts.get(group.id);
        leader = group.leader.src;
    } else {
        emitNet("iggy-boosting:client:dropoffblip", src);
        active = activeSoloContracts.get(cid);
        leader = src;
    }

    let veh = NetworkGetEntityFromNetworkId(active.netId);
    let dropoff = active.dropoff.vector3;
    let dropped = false;

    while (!dropped) {
        await global.exports["iggy-utils"].Delay(500);
        let coords = GetEntityCoords(veh);
        let dist = global.exports["iggy-utils"].CalcDist(
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
    emitNet("iggy-boosting:client:emptyVehicle", leader);

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
        await global.exports["iggy-utils"].Delay(50);
    }

    await global.exports["iggy-utils"].Delay(5000);
    DeleteEntity(veh);
    if (group !== null) {
        let players = [group.leader, ...group.players.concat()];

        players.forEach((player) => {
            let p = QBCore.Functions.GetPlayer(player.src);

            GiveRep(player.cid, active.rewardRep);
            p.Functions.AddMoney("crypto", active.rewardCrypto);
        });
        global.exports["iggy-groups"].GroupEmitNet(
            group.id,
            "iggy-boosting:client:finishContract"
        );
        activeGroupContracts.set(group.id, undefined);
    } else {
        GiveRep(cid, active.rewardRep);
        player.Functions.AddMoney("crypto", active.rewardCrypto);
        emitNet("iggy-boosting:client:finishContract", src);
        activeSoloContracts.set(cid, undefined);
    }
}

function generateTime(hoursFromNow: number, minutesFromNow: number): number {
    const time = new Date();

    time.setHours(time.getHours() + hoursFromNow);
    time.setMinutes(time.getMinutes() + minutesFromNow);

    return Math.floor(time.getTime() / 1000);
}

async function GenerateContract(src: number) {
    let player: Player = QBCore.Functions.GetPlayer(src);

    if (player === undefined) {
        queue = queue.filter((p) => p !== src);
        emitNet("iggy-boosting:client:toggleQueue", src, queue.includes(src));
        return false;
    }
    let cid = player.PlayerData.citizenid;

    let rep = await GetRep(cid);

    let classVehicles: VehicleList = Object.fromEntries(
        Object.entries(VEHICLES).filter(
            ([model, veh]) => veh.class >= rep.level
        )
    );

    const vehicles = Object.values(classVehicles);
    const randomIndex = Math.floor(Math.random() * vehicles.length);

    let vehicle = vehicles[randomIndex];

    let cost = Math.floor(
        global.exports["iggy-utils"].RandomNumber(
            Config.BOOST_PRICE[vehicle.class].min,
            Config.BOOST_PRICE[vehicle.class].max
        )
    );
    let reward = Math.floor(
        (cost === 0 ? 1 : cost) *
            global.exports["iggy-utils"].RandomNumber(1, 3)
    );
    let repReward = Math.floor(
        global.exports["iggy-utils"].RandomNumber(
            Config.REP_REWARD[vehicle.class].min,
            Config.REP_REWARD[vehicle.class].max
        )
    );

    CreateContract(
        vehicle.class,
        vehicle.name,
        vehicle.model,
        repReward,
        cost,
        reward,
        generateTime(1, 0),
        src
    );

    console.log(
        `Awarded Contract [${vehicle.class}] ${vehicle.name} to ${cid} (${src})`
    );
    return true;
}

async function awardContract(iteration = 0) {
    if (iteration > 5) return;
    let i = Math.floor(Math.random() * queue.length);
    let success = await GenerateContract(queue[i]);
    if (!success) awardContract(iteration++);
}

async function ContractLoop() {
    while (true) {
        await global.exports["iggy-utils"].Delay(
            (Config.TIME_BETWEEN_CONTRACTS +
                global.exports["iggy-utils"].RandomNumber(0, 30)) *
                1000
        );
        if (queue.length <= 0) continue;
        let chance = Math.random();

        if (chance >= Config.CONTRACT_CHANCE / 100) {
            continue;
        }
        await awardContract();
    }
}
ContractLoop();

onNet("iggy-boosting:server:getInfo", async () => {
    let src = source;
    let player = QBCore.Functions.GetPlayer(src);
    let cid = player.PlayerData.citizenid;
    let rep: Rep = await GetRep(cid);
    emitNet("iggy-boosting:client:updateRep", src, rep);
    emitNet(
        "iggy-boosting:client:updateContracts",
        src,
        contracts[cid] === undefined ? [] : contracts[cid]
    );
});

onNet("iggy-boosting:server:toggleQueue", async (force?: boolean) => {
    let src = source;
    if (force) {
        if (!queue.includes(src)) return;
        queue = queue.filter((p) => p !== src);
        return;
    }
    if (queue.includes(src)) {
        queue = queue.filter((p) => p !== src);
    } else {
        queue.push(src);
        let player = QBCore.Functions.GetPlayer(src);
        let cid = player.PlayerData.citizenid;

        if (contracts[cid] === undefined) contracts[cid] = [];
    }
    emitNet("iggy-boosting:client:toggleQueue", src, queue.includes(src));
});

onNet("iggy-boosting:server:startContract", async (id: number) => {
    let src = source;

    let player = QBCore.Functions.GetPlayer(src);
    let cid = player.PlayerData.citizenid;

    let contract: Contract = contracts[cid].find((c) => c.id === id);

    if (Date.now() / 1000 > contract.time) {
        emitNet("iggy-boosting:client:error-expired", src);
        DeleteContract(src, id);
        return;
    }
    let group: Group = global.exports["iggy-groups"].GetPlayerGroup(cid);

    let inGroup = group !== null ? true : false;
    let req = getMinMaxPlayers(contract.class);

    if (!inGroup && req.min !== -1) {
        emitNet("iggy-boosting:client:error-no-group", src);
        return;
    } else if (req.min !== -1) {
        if (group.players.length + 1 < req.min) {
            emitNet("iggy-boosting:client:error-min-players", src);
            return;
        }
        if (group.players.length + 1 > req.max) {
            emitNet("iggy-boosting:client:error-max-players", src);
            return;
        }
    }

    if (inGroup) {
        if (activeGroupContracts.get(group.id)) {
            emitNet("iggy-boosting:client:error-active", src);
            return;
        }
    } else {
        if (activeSoloContracts.has(cid)) {
            emitNet("iggy-boosting:client:error-active", src);
            return;
        }
    }

    let location = getLocation(contract.class);
    let dropoff = getDropOff();

    if (!location || !dropoff) {
        emitNet("iggy-boosting:client:error-busy", src);
        return;
    }
    let { netid, plate } = await spawnVehicle(
        contract.model,
        location.vector4,
        contract.class
    );

    if (!netid || !plate) {
        emitNet("iggy-boosting:client:error-veh", src);
        return;
    }

    let active: ActiveContract = {
        ...contract,
        spawn: location,
        dropoff: dropoff,
        hacksFailed: 0,
        plate: plate,
        netId: netid,
        group: inGroup,
        started: false,
    };

    let paid = player.Functions.RemoveMoney(
        "crypto",
        contract.cost,
        "Boost Started"
    );

    if (!paid) {
        emitNet("iggy-boosting:client:error-crypto", src);
        return;
    }

    let blipOffset: Vector3 = {
        x:
            location.vector4.x +
            global.exports["iggy-utils"].RandomNumber(-100, 100),
        y:
            location.vector4.y +
            global.exports["iggy-utils"].RandomNumber(-100, 100),
        z: location.vector4.z,
    };

    DeleteContract(src, contract.id);

    if (inGroup) {
        activeGroupContracts.set(group.id, active);
        global.exports["iggy-groups"].GroupEmitNet(
            group.id,
            "iggy-boosting:client:success-started",
            active.plate,
            blipOffset,
            active
        );
    } else {
        activeSoloContracts.set(cid, active);
        emitNet(
            "iggy-boosting:client:success-started",
            src,
            active.plate,
            blipOffset,
            active
        );
    }
});

onNet("iggy-boosting:server:started", async () => {
    let src: number = source;
    let group: Group =
        global.exports["iggy-groups"].GetPlayerGroupFromSource(src);
    global.exports["iggy-groups"].GroupEmitNet(
        group.id,
        "iggy-boosting:client:started"
    );

    let active = activeGroupContracts.get(group.id);

    if (active.started) return;
    active.started = true;

    let veh = NetworkGetEntityFromNetworkId(active.netId);

    let hacks = Entity(veh).state.hacks;
    while (hacks.remaining > 0) {
        if (!DoesEntityExist(veh)) {
            break;
        }

        let coords = GetEntityCoords(veh);

        emitNet("iggy-boosting:client:createBlip", -1, coords, active.netId);
        await global.exports["iggy-utils"].Delay(
            (Config.DEFAULT_BLIP_DELAY * 1000) / hacks.remaining
        );
        hacks = Entity(veh).state.hacks;
    }
    emitNet("iggy-boosting:client:removeBlip", -1, active.netId);
});

onNet("iggy-boosting:server:startDropOff", () => {
    let src: number = source;
    let contract = getPlayerContract(src);
    if (contract.group) {
        let group: Group =
            global.exports["iggy-groups"].GetPlayerGroupFromSource(src);
        global.exports["iggy-groups"].GroupEmitNet(
            group.id,
            "iggy-boosting:client:started"
        );
    }
    beginDropOff(src);
});

onNet(
    "iggy-boosting:server:hackFailed",
    (netId: number, vehClass: VehicleClass) => {
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

        if (state.failed + 1 === getFailsFromClass(vehClass)) {
            emitNet("iggy-boosting:client:disableVehicle", -1, netId);
        }
    }
);

onNet("iggy-boosting:server:hackComplete", (netId: number) => {
    let src = source;
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
        beginDropOff(src);
    }
});

QBCore.Functions.CreateUseableItem("electronickit", async (src, item) => {
    emitNet("iggy-boosting:client:openHack", src);
});

on("playerDropped", (reason: string) => {
    let src = source;
    emit("iggy-boosting:server:playerLeft", src);
});

// A util event to make adding locations easier
onNet("coords", (coords: any) => {
    console.log(JSON.stringify(coords), "\n\n\n\n\n\n");
});
