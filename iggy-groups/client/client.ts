import { TriggerQBCallBack } from "./cl_utils";
import { Group } from "../shared/Group";
import { Client, PlayerData } from "qbcore.js";
let currentGroup: Group | undefined;
let groups: Group[] = [];
let requests: PlayerData[] = [];

const QBCore: Client = global.exports["qb-core"].GetCoreObject();

global.exports["iggy-laptop"].RegisterLaptopCallback("groups:getGroups", () => {
    let isHost =
        currentGroup?.leader.PlayerData.source ===
        QBCore.Functions.GetPlayerData().source;

    return {
        groups: groups,
        inGroup: currentGroup === undefined ? false : true,
        currentGroup: currentGroup,
        isHost: isHost,
    };
});

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "groups:createGroup",
    async () => {
        let group: Group = await TriggerQBCallBack(
            "iggy-groups:cb:createGroup"
        );
        global.exports["iggy-laptop"].SendAppMessage("groups", "joinGroup", {
            group: group,
            isHost: true,
        });
        currentGroup = group;
        updateGroup();
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "groups:leaveGroup",
    async () => {
        await TriggerQBCallBack("iggy-groups:cb:leaveGroup");
        global.exports["iggy-laptop"].SendAppMessage("groups", "leaveGroup");
        currentGroup = undefined;
        updateGroup();
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "groups:getRequests",
    () => {
        return { requests: requests };
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "groups:requestGroup",
    async (id: number) => {
        emitNet("iggy-groups:server:requestGroup", id);
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "groups:acceptPlayer",
    async (cid: string) => {
        let group: Group = await TriggerQBCallBack(
            "iggy-groups:cb:acceptPlayer",
            cid,
            currentGroup.id
        );
        currentGroup = group;
        requests = requests.filter((player) => player.citizenid !== cid);
        global.exports["iggy-laptop"].SendAppMessage(
            "groups",
            "updateRequests",
            requests
        );
        global.exports["iggy-laptop"].SendAppMessage(
            "groups",
            "updateGroup",
            currentGroup
        );
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "groups:rejectPlayer",
    async (cid: string) => {
        requests = requests.filter((player) => player.citizenid !== cid);
        global.exports["iggy-laptop"].SendAppMessage(
            "groups",
            "updateRequests",
            requests
        );
        global.exports["iggy-laptop"].SendAppMessage(
            "groups",
            "updateGroup",
            currentGroup
        );
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "groups:kickPlayer",
    async (cid: string) => {
        let group: Group = await TriggerQBCallBack(
            "iggy-groups:cb:kickPlayer",
            cid,
            currentGroup.id
        );
        currentGroup = group;
        global.exports["iggy-laptop"].SendAppMessage(
            "groups",
            "updateGroup",
            currentGroup
        );
    }
);

onNet("iggy-groups:client:updateGroups", (newGroups: Group[]) => {
    global.exports["iggy-laptop"].SendAppMessage(
        "groups",
        "updateGroups",
        newGroups
    );
    groups = newGroups;
});

onNet("iggy-groups:client:updateGroup", (newGroup: Group) => {
    global.exports["iggy-laptop"].SendAppMessage(
        "groups",
        "updateGroup",
        newGroup
    );
    currentGroup = newGroup;
});

onNet("iggy-groups:client:promotePlayer", () => {
    global.exports["iggy-laptop"].SendAppMessage("groups", "joinGroup", {
        group: currentGroup,
        isHost: true,
    });
});

onNet("iggy-groups:client:newRequest", (player: PlayerData) => {
    if (requests.includes(player)) return;
    requests = [...requests, player];
    global.exports["iggy-laptop"].SendAppMessage(
        "groups",
        "updateRequests",
        requests
    );
});

onNet("iggy-groups:client:joinGroup", (newGroup: Group) => {
    currentGroup = newGroup;
    global.exports["iggy-laptop"].SendAppMessage("groups", "joinGroup", {
        group: newGroup,
        isHost: false,
    });
    global.exports["iggy-laptop"].SendAppMessage("base", "notification", {
        type: "SUCCESS",
        message: `${currentGroup.leader.PlayerData.charinfo.firstname} accepted your join request`,
        duration: 5000,
    });
    updateGroup();
});

onNet("iggy-groups:client:kicked", () => {
    currentGroup = undefined;
    global.exports["iggy-laptop"].SendAppMessage("groups", "leaveGroup");
    updateGroup();
});

onNet("iggy-groups:client:requestInGroup", () => {
    global.exports["iggy-laptop"].SendAppMessage("base", "notification", {
        type: "ERROR",
        message: `That player is already in a group.`,
    });
});

function updateGroup() {
    emitNet("iggy-groups:updateGroup", currentGroup);
    emit("iggy-groups:updateGroup", currentGroup);
}

function IsInGroup(): boolean {
    return currentGroup === undefined ? false : true;
}
global.exports("IsInGroup", IsInGroup);

function GetGroup(): Group | undefined {
    return currentGroup;
}
global.exports("GetGroup", GetGroup);
