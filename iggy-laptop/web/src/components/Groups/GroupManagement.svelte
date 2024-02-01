<script lang="ts">
    import type { Player, PlayerData } from "@zerio2/qbcore.js";
    import { fetchNui } from "../../utils/fetchNui";
    import PlayerCard from "./PlayerCard.svelte";
    import RequestCard from "./RequestCard.svelte";
    import type { Group } from "./types";
    import { useNuiEvent } from "../../utils/useNuiEvent";

    export let group: Group;
    export let isHost: boolean;
    let requests: PlayerData[] = [];
    function leaveGroup() {
        fetchNui("groups:leaveGroup");
    }

    fetchNui("groups:getRequests").then((data) => {
        requests = data.requests;
    });

    useNuiEvent<PlayerData[]>("groups", "updateRequests", (data) => {
        requests = data;
    });
</script>

<div class="w-full h-full p-16 flex flex-col">
    <div class=" h-min w-full flex py-1">
        <h1 class="text-3xl font-bold text-white">
            {isHost ? "Manage" : "Your"} Group
        </h1>
        <button
            class="ml-auto p-1 rounded-md border border-red-500 text-red-500 hover:bg-red-400 hover:bg-opacity-25"
            on:click={leaveGroup}
        >
            Leave Group
        </button>
    </div>
    <div class="flex gap-1">
        <div class="w-full h-full py-1">
            <div
                class="grid grid-rows-3 gap-3 h-full overflow-auto py-1 w-full"
            >
                {#if group.players !== undefined}
                    {#each group.players as player}
                        <PlayerCard {player} host={isHost} />
                    {/each}
                {/if}
            </div>
        </div>
        {#if isHost}
            <div class="w-full h-full py-1">
                <div class="grid grid-cols-1 gap-3 py-1 w-full overflow-auto">
                    {#each requests as player}
                        <RequestCard {player} />
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</div>
