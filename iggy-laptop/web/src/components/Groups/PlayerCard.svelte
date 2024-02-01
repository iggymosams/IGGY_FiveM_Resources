<script lang="ts">
    import type { Player } from "@zerio2/qbcore.js";
    import { fetchNui } from "../../utils/fetchNui";

    export let player: Player;
    export let host: boolean = false;

    function kickPlayer() {
        fetchNui("groups:kickPlayer", player.PlayerData.citizenid);
    }

    // TODO:
    function promotePlayer() {
        fetchNui("groups:promotePlayer", player.PlayerData.citizenid);
    }
</script>

<div
    class=" border border-violet-500 text-white h-full w-full rounded-lg p-4 flex items-center gap-3"
>
    <h1 class="font-bold text-3xl">
        {player.PlayerData.charinfo.firstname}
        {player.PlayerData.charinfo.lastname}
    </h1>
    {#if host}
        <button
            class="ml-auto h-min py-2 px-4 rounded-md border border-red-500 text-red-500 hover:bg-red-400 hover:bg-opacity-25"
            on:click={kickPlayer}
        >
            Kick
        </button>
        <!-- <button
            class="p-1 h-min py-2 px-4 rounded-md border border-red-500 text-red-500 hover:bg-red-400 hover:bg-opacity-25"
            on:click={promotePlayer}
        >
            Promote
        </button> -->
    {/if}
</div>
