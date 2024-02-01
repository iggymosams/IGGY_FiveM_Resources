<script lang="ts">
    import type { Player, PlayerData } from "@zerio2/qbcore.js";
    import { fetchNui } from "../../utils/fetchNui";

    export let player: PlayerData;

    function acceptPlayer() {
        fetchNui("groups:acceptPlayer", player.citizenid);
    }

    function rejectPlayer() {
        fetchNui("groups:rejectPlayer", player.citizenid);
    }
</script>

<div
    class="border border-violet-500 text-white h-min w-full rounded-lg p-4 flex items-center gap-3"
>
    <h1 class="font-bold text-3xl">
        {player.charinfo.firstname}
        {player.charinfo.lastname}
    </h1>
    <button
        class="ml-auto h-min py-2 px-4 rounded-md border border-green-500 text-green-500 hover:bg-green-400 hover:bg-opacity-25"
        on:click={acceptPlayer}
    >
        Accept
    </button>
    <button
        class="p-1 h-min py-2 px-4 rounded-md border border-red-500 text-red-500 hover:bg-red-400 hover:bg-opacity-25"
        on:click={rejectPlayer}
    >
        Reject
    </button>
</div>
