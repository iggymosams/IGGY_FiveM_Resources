import { Player, Server } from "qbcore.js";
import { Group } from "../shared/Group";

let currentId: number = 1;
let groups: Group[] = [];

const QBCore: Server = global.exports["qb-core"].GetCoreObject();

QBCore.Functions.CreateCallback(
    "iggy-groups:cb:createGroup",
    (src, cb: (data: Group) => void) => {
        let player: Player = QBCore.Functions.GetPlayer(src);
        let group: Group = new Group(currentId, player);
        addGroup(group);
        emitNet("iggy-groups:client:updateGroups", -1, groups);
        cb(group);
    }
);
QBCore.Functions.CreateCallback(
    "iggy-groups:cb:leaveGroup",
    (src, cb: () => void) => {
        let player: Player = QBCore.Functions.GetPlayer(src);
        let group: Group = GetPlayerGroup(player.PlayerData.citizenid);
        if (group.players.length !== 0) {
            group.removePlayer(player.PlayerData.citizenid);
        } else {
            deleteGroup(group.id);
            group = undefined;
        }

        if (group !== undefined) {
            GroupEmitNet(group.id, "iggy-groups:client:updateGroup", group);
        } else {
            emitNet("iggy-groups:client:kicked", player.PlayerData.source);
        }
        emitNet("iggy-groups:client:updateGroups", -1, groups);
        cb();
    }
);

onNet("iggy-groups:server:requestGroup", (id: number) => {
    let src = source;
    let player: Player = QBCore.Functions.GetPlayer(src);
    let group: Group = GetGroupById(id);
    let leader = group.leader;
    emitNet(
        "iggy-groups:client:newRequest",
        leader.PlayerData.source,
        player.PlayerData
    );
});

QBCore.Functions.CreateCallback(
    "iggy-groups:cb:acceptPlayer",
    (src, cb: (group: Group) => void, args: any[]) => {
        let cid: string = args[0];
        let id: number = args[1];
        let group: Group = GetGroupById(id);

        if (GetPlayerGroup(cid) !== undefined) {
            emitNet("iggy-groups:client:requestInGroup", src);
            cb(group);
            return;
        }
        let player: Player = QBCore.Functions.GetPlayerByCitizenId(cid);
        group.addPlayer(player);
        emitNet(
            "iggy-groups:client:joinGroup",
            player.PlayerData.source,
            group
        );
        emitNet("iggy-groups:client:updateGroups", -1, groups);

        cb(group);
    }
);

QBCore.Functions.CreateCallback(
    "iggy-groups:cb:kickPlayer",
    (src, cb: (group: Group) => void, args: any[]) => {
        let cid: string = args[0];
        let id: number = args[1];
        let player: Player = QBCore.Functions.GetPlayerByCitizenId(cid);
        let group: Group = GetGroupById(id);
        group.removePlayer(cid);
        emitNet("iggy-groups:client:kicked", player.PlayerData.source, group);
        emitNet("iggy-groups:client:updateGroups", -1, groups);

        cb(group);
    }
);

function addGroup(group: Group) {
    groups = [...groups, group];
    currentId++;
}

function deleteGroup(id: number) {
    groups = groups.filter((g) => g.id !== id);
}

function GetGroupById(id: number): Group {
    return groups.find((g) => g.id === id);
}
global.exports("GetGroupById", GetGroupById);

function GetGroupFromLeader(cid: string): Group | undefined {
    return groups.find((g) => g.leader.PlayerData.citizenid === cid);
}
global.exports("GetGroupFromLeader", GetGroupFromLeader);

function GetPlayerGroup(cid: string): Group | undefined {
    return groups.find(
        (g) =>
            g.leader.PlayerData.citizenid === cid ||
            g.players.find((p) => p.PlayerData.citizenid === cid)
    );
}
global.exports("GetPlayerGroup", GetPlayerGroup);

function GroupEmitNet(groupId: number, eventName: string, ...args: any[]) {
    let group = GetGroupById(groupId);
    emitNet(eventName, group.leader.PlayerData.source, ...args);

    group.players.forEach((player) => {
        emitNet(eventName, player.PlayerData.source, ...args);
    });
}
global.exports("GroupEmitNet", GroupEmitNet);
