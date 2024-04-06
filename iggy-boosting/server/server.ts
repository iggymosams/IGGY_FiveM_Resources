import { Server } from "@zerio2/qbcore.js";
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
} from "../shared/types";
import { DROP_OFF_LOCATIONS, SPAWN_LOCATIONS } from "../shared/locations";
import { CalcDist, Delay } from "../shared/utils";
import { Group } from "./../../iggy-groups/shared/types";

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
    switch (vehClass) {
        case "A":
            return { min: 2, max: 4 };
        case "B":
            return { min: 2, max: 2 };
        case "C":
            return { min: -1, max: -1 };

        default:
            break;
    }
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
    switch (vehClass) {
        case "A":
            return 20;
        case "B":
            return 10;
        case "C":
            return 0;
        default:
            break;
    }
}

function getFailsFromClass(vehClass: VehicleClass): number {
    switch (vehClass) {
        case "A":
            return 3;
        case "B":
            return 7;
        case "C":
            return 0;
        default:
            break;
    }
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

onNet("iggy-boosting:server:toggleQueue", async () => {
    let src = source;
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

    // TODO: ADDED OFFSET
    let blipOffset: Vector3 = {
        x: location.vector4.x,
        y: location.vector4.y,
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
        await global.exports["iggy-utils"].Delay((10 * 1000) / hacks.remaining);
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
        date.setSeconds(date.getSeconds() + 1);
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
    date.setSeconds(date.getSeconds() + 1);
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

//TODO: DELETE
onNet("boost:create", (veh: string) => {
    let src = source;
    let v: VehicleClass = veh ? (veh as VehicleClass) : "C";
    CreateContract(v, "Adder", "adder", 1, 1, 1, 1712326762, src);
});

QBCore.Functions.CreateUseableItem("electronickit", async (src, item) => {
    emitNet("iggy-boosting:client:openHack", src);
});
