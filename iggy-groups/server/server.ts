import { Player, Server } from "@zerio2/qbcore.js";
import type {
    GroupPlayer,
    Group,
    PublicGroup,
    GroupType,
} from "../shared/types";
import { GroupToPublicGroup } from "../shared/utils";

const QBCore: Server = global.exports["qb-core"].GetCoreObject();

let currentId: number = 1;

let groups: Group[] = [];

function GetGroupPlayerFromPlayer(src: string | number): GroupPlayer {
    let player: Player = QBCore.Functions.GetPlayer(src);
    return {
        name: `${player.PlayerData.charinfo.firstname} ${player.PlayerData.charinfo.lastname}`,
        cid: player.PlayerData.citizenid,
        src: player.PlayerData.source,
    };
}

async function GetGroupPlayerFromHandle(
    src: string | number
): Promise<GroupPlayer> {
    let player: Player = QBCore.Functions.GetPlayer(src);
    return {
        name: await global.exports["iggy-laptop"].GetHandle(src),
        cid: player.PlayerData.citizenid,
        src: player.PlayerData.source,
    };
}

function CreateGroup(leader: GroupPlayer, type: GroupType): Group {
    let group: Group = {
        id: currentId,
        leader: leader,
        players: [],
        requests: [],
        type: type,
    };
    currentId++;
    groups.push(group);
    return group;
}

function UpdateGroups() {
    let publicGroups = groups.map(GroupToPublicGroup);
    emitNet("iggy-groups:client:updateGroups", -1, publicGroups);
}

function UpdateGroup(group: Group) {
    emitNet("iggy-groups:client:updateGroup", group.leader.src, group);
    group.players.forEach((p) => {
        emitNet("iggy-groups:client:updateGroup", p.src, group);
    });
    UpdateGroups();
}

function leaveGroup(group: Group, src: number) {
    let player: GroupPlayer;
    let isLeader = false;
    if (group.leader.src === src) {
        player = group.leader;
        isLeader = true;
    } else {
        player = group.players.find((p) => p.src === src);
    }

    if (isLeader) {
        if (group.players.length === 0) {
            groups = groups.filter((g) => g.id !== group.id);
            emitNet("iggy-groups:client:leaveGroup", src);
            UpdateGroups();
            return;
        } else {
            let newLeader = group.players[0];
            group.leader = newLeader;
            group.players = group.players.filter((p) => p !== newLeader);
        }
    } else {
        group.players = group.players.filter((p) => p !== player);
    }

    emitNet("iggy-groups:client:leaveGroup", src);
    UpdateGroup(group);
}

QBCore.Functions.CreateCallback(
    "iggy-groups:cb:createGroup",
    (src, cb: (data: Group) => void) => {
        let group: Group = CreateGroup(GetGroupPlayerFromPlayer(src), "PUBLIC");
        UpdateGroups();
        cb(group);
    }
);

QBCore.Functions.CreateCallback(
    "iggy-groups:cb:createPrivateGroup",
    async (src, cb: (data: Group) => void) => {
        let group: Group = CreateGroup(
            await GetGroupPlayerFromHandle(src),
            "PRIVATE"
        );
        UpdateGroups();
        cb(group);
    }
);

onNet("iggy-groups:server:kickPlayer", (player: string, id: number) => {
    let group = GetGroupById(id);
    let gPlayer = group.players.find((p) => p.name === player);

    group.players = group.players.filter((p) => p !== gPlayer);

    emitNet("iggy-groups:client:leaveGroup", gPlayer.src);
    UpdateGroup(group);
});

onNet("iggy-groups:server:promotePlayer", (player: string, id: number) => {
    let group = GetGroupById(id);

    let gPlayer = group.players.find((p) => p.name === player);
    let leader = group.leader;

    group.leader = gPlayer;
    group.players.push(leader);
    group.players = group.players.filter((p) => p !== gPlayer);

    emitNet("iggy-groups:client:joinGroup", leader.src, group);
    emitNet("iggy-groups:client:joinGroup", gPlayer.src, group, true);
    UpdateGroup(group);
});

onNet("iggy-groups:server:requestGroup", async (id: number) => {
    let src = source;
    let group = GetGroupById(id);
    let player: GroupPlayer;
    if (group.type === "PRIVATE") {
        player = await GetGroupPlayerFromHandle(src);
        if (player.name === null) {
            player = GetGroupPlayerFromPlayer(src);
        }
    } else {
        player = GetGroupPlayerFromPlayer(src);
    }

    if (!group.requests.find((r) => r.cid === player.cid)) {
        group.requests.push(player);

        emitNet(
            "iggy-groups:client:updateRequests",
            group.leader.src,
            group.requests.map((r) => r.name)
        );
    }
});

onNet("iggy-groups:server:leaveGroup", (id: number) => {
    let src = source;

    let group = GetGroupById(id);
    leaveGroup(group, src);
});

onNet("iggy-groups:server:acceptRequest", (req: string, id: number) => {
    let src = source;
    let group = GetGroupById(id);

    let request = group.requests.find((r) => req === r.name);

    group.requests = group.requests.filter((r) => r !== request);

    if (GetPlayerGroupFromSource(request.src)) return;

    group.players.push(request);

    emitNet("iggy-groups:client:joinGroup", request.src, group);
    emitNet(
        "iggy-groups:client:updateRequests",
        group.leader.src,
        group.requests.map((r) => r.name)
    );
    UpdateGroup(group);
});

onNet("iggy-groups:server:rejectRequest", (req: string, id: number) => {
    let src = source;
    let group = GetGroupById(id);

    let request = group.requests.find((r) => req === r.name);

    group.requests = group.requests.filter((r) => r !== request);

    emitNet(
        "iggy-groups:client:updateRequests",
        group.leader.src,
        group.requests.map((r) => r.name)
    );
    UpdateGroups();
});

onNet("iggy-groups:server:getGroups", () => {
    emitNet(
        "iggy-groups:client:updateGroups",
        -1,
        groups.map((group) => GroupToPublicGroup(group))
    );
});

onNet("iggy-groups:server:getRequests", (id: number) => {
    let group = GetGroupById(id);

    emitNet(
        "iggy-groups:client:updateRequests",
        group.leader.src,
        group.requests.map((r) => r.name)
    );
});

onNet("iggy-groups:server:getGroup", (id: number) => {
    let group = GetGroupById(id);

    UpdateGroup(group);
});

function GetGroupById(id: number): Group {
    return groups.find((g) => g.id === id);
}
global.exports("GetGroupById", GetGroupById);

function GetGroupFromLeaderCid(cid: string): Group | undefined {
    return groups.find((g) => g.leader.cid === cid);
}
global.exports("GetGroupFromLeaderCid", GetGroupFromLeaderCid);

function GetGroupFromLeaderName(name: string): Group | undefined {
    return groups.find((g) => g.leader.name === name);
}
global.exports("GetGroupFromLeaderName", GetGroupFromLeaderName);

function GetPlayerGroup(cid: string): Group | undefined {
    return groups.find(
        (g) => g.leader.cid === cid || g.players.find((p) => p.cid === cid)
    );
}
global.exports("GetPlayerGroup", GetPlayerGroup);

function GetPlayerGroupFromName(name: string): Group | undefined {
    return groups.find(
        (g) => g.leader.name === name || g.players.find((p) => p.name === name)
    );
}
global.exports("GetPlayerGroupFromName", GetPlayerGroupFromName);

function GetPlayerGroupFromSource(src: string | number): Group | undefined {
    return groups.find(
        (g) => g.leader.src === src || g.players.find((p) => p.src === src)
    );
}
global.exports("GetPlayerGroupFromSource", GetPlayerGroupFromSource);

function GroupEmitNet(id: number, eventName: string, ...args: unknown[]) {
    let group = GetGroupById(id);

    emitNet(eventName, group.leader.src, ...args);
    group.players.forEach((p) => {
        emitNet(eventName, p.src, ...args);
    });
}
global.exports("GroupEmitNet", GroupEmitNet);

on("playerDropped", (reason: string) => {
    let src = source;
    let group = GetPlayerGroupFromSource(src);
    leaveGroup(group, src);
});
