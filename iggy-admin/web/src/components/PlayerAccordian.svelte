<script lang="ts">
    import { slide } from "svelte/transition";
    import type { AdminPlayerData } from "../types/types";
    import { fetchNui } from "../utils/fetchNui";

    export let open = false;

    export let player: AdminPlayerData;

    function toggle() {
        open = !open;
    }
</script>

<button
    class={`w-full text-left grid grid-cols-6 hover:bg-gray-300 bg-${
        open ? "gray-200" : "white"
    } transition-colors duration-150`}
    on:click|preventDefault={toggle}
>
    <span class="col-span-1">{player.serverId}</span>
    <span class="col-span-2">{player.username}</span>
    <span class="col-span-3">{player.steam}</span>
</button>
{#if open}
    <div
        class="w-full bg-gray-200 flex flex-col gap-1 flex-none p-1"
        transition:slide={{ duration: 150 }}
    >
        <div class="bg-gray-300 p-1 rounded-md w-full">
            <h1 class="text-lg font-semibold">Identifiers</h1>
            <div class="flex flex-col">
                {#each player.identifiers as id}
                    <span>{id}</span>
                {/each}
            </div>
        </div>
        <div class="bg-gray-300 p-1 rounded-md w-full">
            <h1 class="text-lg font-semibold">Character Info</h1>
            <div class="flex flex-col">
                <span>CID: {player.charInfo.cid}</span>
                <span>Name: {player.charInfo.name}</span>
                <span>Job: {player.charInfo.job}</span>
                <span>Gang: {player.charInfo.gang}</span>
                <span>Phone: {player.charInfo.phone}</span>
                <span>Bank: {player.charInfo.bank}</span>
                <span>Cash: {player.charInfo.cash}</span>
                <span>Crypto: {player.charInfo.crypto}</span>
            </div>
        </div>
        <div class="bg-gray-300 p-1 rounded-md w-full">
            <h1 class="text-lg font-semibold">Vehicles</h1>
            <div class="flex flex-col gap-1 flex-initial">
                {#each player.vehicles as vehicle}
                    <div
                        class="p-3 bg-gray-400 rounded-md w-full flex gap-3 items-center h-full"
                    >
                        <span class="text-lg">{vehicle.vehicle}</span>
                        <span>Plate: {vehicle.plate}</span>
                        <span>
                            State: {vehicle.state == 1 ? "IN" : "OUT"}
                        </span>
                        <button
                            class="ml-auto bg-gray-300 p-1 rounded-md hover:bg-gray-200 active:bg-gray-500 transition-colors duration-150"
                            on:click={() =>
                                fetchNui("iggy-admin:spawnPlayerVehicle", {
                                    event: "iggy-admin:server:spawnPlayerVehicle",
                                    data: {
                                        values: {
                                            ["plate"]: vehicle.plate,
                                        },
                                    },
                                    type: "SERVER",
                                })}
                        >
                            Spawn
                        </button>
                    </div>
                {/each}
            </div>
        </div>
    </div>
{/if}
