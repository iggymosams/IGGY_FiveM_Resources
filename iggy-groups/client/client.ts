import { Client } from "@zerio2/qbcore.js";
import type { GroupPlayer, Group, PublicGroup } from "../shared/types";
import { GroupToPublicGroup } from "../shared/utils";

const QBCore: Client = global.exports["qb-core"].GetCoreObject();

let CurrentGroupId: number;

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "groups:getInfo",
    async () => {
        emitNet("iggy-groups:server:getGroups");
        if (CurrentGroupId) {
            emitNet("iggy-groups:server:getRequests", CurrentGroupId);
            emitNet("iggy-groups:server:getGroup", CurrentGroupId);
        } else {
            global.exports["iggy-laptop"].SendAppMessage(
                "groups",
                "leaveGroup"
            );
        }
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "groups:createGroup",
    async () => {
        let group: Group = await global.exports["iggy-utils"].TriggerQBCallBack(
            "iggy-groups:cb:createGroup"
        );
        CurrentGroupId = group.id;
        global.exports["iggy-laptop"].SendAppMessage("groups", "joinGroup", {
            group: GroupToPublicGroup(group),
            isHost: true,
        });
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "groups:createPrivateGroup",
    async () => {
        let group: Group = await global.exports["iggy-utils"].TriggerQBCallBack(
            "iggy-groups:cb:createPrivateGroup"
        );
        CurrentGroupId = group.id;
        global.exports["iggy-laptop"].SendAppMessage("groups", "joinGroup", {
            group: GroupToPublicGroup(group),
            isHost: true,
        });
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "groups:requestGroup",
    async (id: number) => {
        emitNet("iggy-groups:server:requestGroup", id);
        global.exports["iggy-laptop"].SendNotification(
            "Request Sent",
            "SUCCESS"
        );
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "groups:acceptRequest",
    async (request: string) => {
        emitNet("iggy-groups:server:acceptRequest", request, CurrentGroupId);
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "groups:rejectRequest",
    async (request: string) => {
        emitNet("iggy-groups:server:rejectRequest", request, CurrentGroupId);
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "groups:promotePlayer",
    async (player: string) => {
        emitNet("iggy-groups:server:promotePlayer", player, CurrentGroupId);
        global.exports["iggy-laptop"].SendNotification(
            "Promoted " + player,
            "SUCCESS"
        );
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "groups:kickPlayer",
    async (player: string) => {
        emitNet("iggy-groups:server:kickPlayer", player, CurrentGroupId);
        global.exports["iggy-laptop"].SendNotification(
            "Kicked " + player,
            "SUCCESS"
        );
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "groups:leaveGroup",
    () => {
        emitNet("iggy-groups:server:leaveGroup", CurrentGroupId);
    }
);

onNet("iggy-groups:client:updateGroups", (newGroups: PublicGroup[]) => {
    global.exports["iggy-laptop"].SendAppMessage(
        "groups",
        "updateGroups",
        newGroups
    );
});

onNet("iggy-groups:client:updateRequests", (requests: string[]) => {
    global.exports["iggy-laptop"].SendAppMessage(
        "groups",
        "updateRequests",
        requests
    );
});

onNet("iggy-groups:client:joinGroup", (group: Group, isHost = false) => {
    CurrentGroupId = group.id;

    global.exports["iggy-laptop"].SendAppMessage("groups", "joinGroup", {
        group: GroupToPublicGroup(group),
        isHost: isHost,
    });
});

onNet("iggy-groups:client:updateGroup", (group: Group) => {
    global.exports["iggy-laptop"].SendAppMessage(
        "groups",
        "updateGroup",
        GroupToPublicGroup(group)
    );
});

onNet("iggy-groups:client:leaveGroup", () => {
    CurrentGroupId = undefined;
    global.exports["iggy-laptop"].SendAppMessage("groups", "leaveGroup");
});

function IsInGroup(): boolean {
    return CurrentGroupId === undefined ? false : true;
}
global.exports("IsInGroup", IsInGroup);

onNet("QBCore:Client:OnPlayerUnload", () => {
    if (CurrentGroupId)
        emitNet("iggy-groups:server:leaveGroup", CurrentGroupId);
});
