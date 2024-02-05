<script lang="ts">
    import type { AdminPlayerData } from "../types/types";
    import { fetchNui } from "../utils/fetchNui";
    import PlayerAccordian from "./PlayerAccordian.svelte";

    let players: AdminPlayerData[] = [];
    fetchNui("iggy-admin:getPlayersData")
        .then((data) => (players = data))
        .catch(() => {});
</script>

<div class="w-full h-1/6 flex-auto bg-white flex flex-col overflow-auto">
    <div class="w-full grid grid-cols-6">
        <span class="col-span-1">Server ID</span>
        <span class="col-span-2">Username</span>
        <span class="col-span-3">Steam</span>
        <!-- <span class="col-span-4">Quick Actions</span> -->
    </div>
    <div class="w-full h-full flex-auto">
        {#each players as player}
            <PlayerAccordian {player} />
        {/each}
    </div>
</div>
