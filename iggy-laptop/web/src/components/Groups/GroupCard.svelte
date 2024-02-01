<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { Group } from "./types";
    import { fetchNui } from "../../utils/fetchNui";

    export let group: Group;

    function requestGroup() {
        fetchNui("groups:requestGroup", group.id);
    }
</script>

<button
    class="h-12 rounded-lg flex items-center border border-violet-500 bg-gradient-to-b from-violet-500 to-violet-700 text-white hover:to-violet-600 transition-all duration-150 hover:text-black"
    on:click={requestGroup}
>
    <div class="h-full aspect-square">
        <Icon icon="clarity:group-solid" class="h-full w-full" />
    </div>
    <div class="text-xl font-bold">
        {group.leader.PlayerData.charinfo.firstname}
        {group.leader.PlayerData.charinfo.lastname}
    </div>
    <div class="ml-auto mr-3">{group.players.length + 1}/3</div>
</button>
