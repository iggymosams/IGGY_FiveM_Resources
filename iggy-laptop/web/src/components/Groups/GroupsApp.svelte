<script lang="ts">
    import { useNuiEvent } from "../../utils/useNuiEvent";
    import { debugData } from "../../utils/debugData";
    import type { Group } from "./types";
    import { fetchNui } from "../../utils/fetchNui";
    import GroupList from "./GroupList.svelte";
    import GroupManagement from "./GroupManagement.svelte";

    let groups: Group[] = [];
    let inGroup: boolean = false;
    let currentGroup: Group | undefined;
    let isHost: boolean = false;

    fetchNui("groups:getGroups").then((data) => {
        groups = data.groups;
        currentGroup = data.currentGroup;
        inGroup = data.inGroup;
        isHost = data.isHost;
    });

    useNuiEvent<Group[]>("groups", "updateGroups", (data) => {
        groups = data;
    });

    useNuiEvent<{ group: Group; isHost: boolean }>(
        "groups",
        "joinGroup",
        (data) => {
            currentGroup = data.group;
            isHost = data.isHost;
            inGroup = true;
        }
    );
    useNuiEvent("groups", "leaveGroup", () => {
        currentGroup = undefined;
        inGroup = false;
    });

    useNuiEvent<Group>("groups", "updateGroup", (data) => {
        currentGroup = data;
    });

    // debugData([
    //     {
    //         app: "groups",
    //         action: "joinGroup",
    //         data: {
    //             group: {
    //                 players: [
    //                     {
    //                         PlayerData: {
    //                             charinfo: {
    //                                 firstname: "CL1",
    //                                 lastname: "CL1",
    //                             },
    //                             source: 1,
    //                             name: "iggymosams",
    //                             id: 1,
    //                         },
    //                         cid: 1,
    //                         citizenid: "VQI16707",
    //                         optin: true,
    //                     },
    //                 ],
    //                 leader: {
    //                     PlayerData: {
    //                         charinfo: {
    //                             firstname: "CL1",
    //                             lastname: "CL1",
    //                         },
    //                         source: 1,
    //                         name: "iggymosams",
    //                         id: 1,
    //                     },
    //                     cid: 1,
    //                     citizenid: "VQI16707",
    //                     optin: true,
    //                 },
    //                 requests: [],
    //                 id: 1,
    //             },
    //             isHost: true,
    //         },
    //     },
    // ]);
</script>

{#if !inGroup}
    <GroupList {groups} />
{:else if currentGroup !== undefined}
    <GroupManagement group={currentGroup} {isHost} />
{/if}
