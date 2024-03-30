import type { Group, PublicGroup } from "./types";

function GroupToPublicGroup(group: Group): PublicGroup {
    return {
        id: group.id,
        leader: group.leader.name,
        players: group.players.map((p) => p.name),
    };
}

export { GroupToPublicGroup };
