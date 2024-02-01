<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { Group } from "./types";
    import GroupCard from "./GroupCard.svelte";

    export let groups: Group[];
    export let createGroup: () => void;
</script>

<div class="w-full h-full flex flex-col p-3 gap-3">
    <button
        class="w-full h-1/3 rounded-lg text-4xl font-semibold text-center flex-none border border-violet-500 bg-gradient-to-b from-violet-500 to-violet-700 text-white hover:to-violet-600 transition-all duration-150 hover:text-black"
        on:click={createGroup}
    >
        <div class="w-full text-center flex justify-center">
            <Icon icon="iconamoon:enter-bold" />
        </div>
        Create Group
    </button>
    <div
        class="flex-auto w-full h-full grid grid-cols-2 gap-3 content-start overflow-auto"
    >
        {#each groups as group}
            <GroupCard {group} />
        {/each}
    </div>
</div>
