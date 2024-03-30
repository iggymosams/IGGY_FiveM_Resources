<script lang="ts">
    import AppShell from "../../../components/AppShell.svelte";
    import type { ConfigApp } from "../../../utils/apps";
    import { debugData } from "../../../utils/debugData";
    import { useNuiEvent } from "../../../utils/useNuiEvent";
    import type { Group } from "../types";
    import GroupList from "./GroupList.svelte";
    import { fetchNui } from "../../../utils/fetchNui";
    import GroupManagement from "./GroupManagement.svelte";
    import { group, isGroupHost, groups } from "../../../store/groups";
    import { onMount } from "svelte";

    export let app: ConfigApp;

    interface joinGroupData {
        group: Group;
        isHost: boolean;
    }
    useNuiEvent<joinGroupData>("groups", "joinGroup", (data) => {
        group.set(data.group);
        isGroupHost.set(data.isHost);
    });

    useNuiEvent<Group[]>("groups", "updateGroups", (data) => {
        groups.set(data);
    });

    useNuiEvent<Group>("groups", "updateGroup", (data) => {
        group.set(data);
    });

    useNuiEvent("groups", "leaveGroup", () => {
        group.set(undefined);
        isGroupHost.set(false);
    });

    onMount(() => {
        fetchNui("groups:getGroups");
    });

    debugData([
        // {
        //     app: "groups",
        //     action: "joinGroup",
        //     data: {
        //         group: { leader: "null", players: ["Hello", "World", "Hi"] },
        //         isHost: true,
        //     },
        // },
        {
            app: "groups",
            action: "updateGroups",
            data: [
                { leader: "null", players: [] },
                { leader: "null", players: ["test"] },
                { leader: "null", players: ["g"] },
                { leader: "null", players: ["g"] },
                { leader: "null", players: ["g"] },
                { leader: "null", players: ["g"] },
                { leader: "null", players: ["g"] },
                { leader: "null", players: ["g"] },
                { leader: "null", players: ["g"] },
                { leader: "null", players: ["g"] },
                { leader: "null", players: ["g"] },
                { leader: "null", players: ["g"] },
                { leader: "null", players: ["g"] },
                { leader: "null", players: ["g"] },

                { leader: "null", players: [] },
            ],
        },
    ]);
</script>

<AppShell name={app.name} class="bg-neutral-800 p-3 text-white  h-full">
    {#if $group}
        <GroupManagement />
    {:else}
        <GroupList />
    {/if}
</AppShell>
