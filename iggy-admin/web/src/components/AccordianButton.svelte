<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { CommandType, EventType } from "src/types/types";
    import { fetchNui } from "../utils/fetchNui";
    import { createEventDispatcher } from "svelte";

    export let active: boolean = false;
    export let favourite: boolean;

    export let id: string;
    export let name: string;
    export let event: string;
    export let type: EventType;
    export let cmdType: CommandType;
    function toggle() {
        if (cmdType == "TOGGLE") active = !active;
        fetchNui("iggy-admin:runCommand", {
            event: event,
            type: type,
            id: id,
        });
    }

    function toggleFavourite() {
        favourite = !favourite;
        fetchNui("iggy-admin:toggleFavourite", id);
    }

    const dispatch = createEventDispatcher();

    $: dispatch("favouriteChange", { id, favourite });
</script>

<div class="w-full">
    <button
        class={`w-full p-1 flex items-center  ${
            active
                ? "bg-green-300 hover:bg-green-400"
                : "bg-white hover:bg-gray-300"
        } transition-colors duration-150`}
        on:click|preventDefault={toggle}
    >
        <span class="h-full mx-3">{name}</span>
        <button
            class="ml-auto h-full text-xl text-yellow-500"
            on:click|preventDefault|stopPropagation={toggleFavourite}
        >
            {#if favourite}
                <Icon icon="material-symbols:star" class="w-full h-full" />
            {:else}
                <Icon
                    icon="material-symbols:star-outline"
                    class="w-full h-full"
                />
            {/if}
        </button>
    </button>
</div>
