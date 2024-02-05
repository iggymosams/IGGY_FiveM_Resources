<script lang="ts">
    import { slide } from "svelte/transition";
    import type { AdminPlayerData } from "../../../types/types";
    import { fetchNui } from "../../../utils/fetchNui";

    export let open = false;

    export let player: AdminPlayerData;

    function toggle() {
        open = !open;
    }
</script>

<div class="w-full text-neutral-100 flex-none">
    <button
        class={`w-full p-1  grid grid-cols-7 hover:bg-neutral-700 ${
            open ? "bg-neutral-800" : "bg-neutral-900"
        } transition-colors duration-150 text-left`}
        on:click|preventDefault={toggle}
    >
        <div class="col-span-1">{player.serverId}</div>
        <div class="col-span-3">{player.username}</div>
        <div class="col-span-3 overflow-hidden overflow-ellipsis">
            {player.steam}
        </div>
    </button>
    {#if open}
        <div
            class="w-full px-1 py-1 bg-neutral-900 flex flex-col gap-1"
            transition:slide={{ duration: 150 }}
        >
            <div class="bg-neutral-800 p-1 rounded-md w-full overflow-hidden">
                <h1 class="text-lg font-semibold">Identifiers</h1>
                <div
                    class="flex flex-col overflow-hidden overflow-ellipsis flex-none"
                >
                    {#each player.identifiers as id}
                        <div class="overflow-hidden overflow-ellipsis">
                            {id}
                        </div>
                    {/each}
                </div>
            </div>
            <div class="bg-neutral-800 p-1 rounded-md w-full">
                <h1 class="text-lg font-semibold">Character Info</h1>
                <div class="flex flex-col">
                    <span>CID: {player.charInfo.cid}</span>
                    <span>Name: {player.charInfo.name}</span>
                    <span>Job: {player.charInfo.job}</span>
                    <span>Gang: {player.charInfo.gang}</span>
                    <span>Phone: {player.charInfo.phone}</span>
                    <span>Bank: ${player.charInfo.bank}</span>
                    <span>Cash: ${player.charInfo.cash}</span>
                    <span>Crypto: {player.charInfo.crypto}</span>
                </div>
            </div>
            <div class="bg-neutral-800 p-1 rounded-md w-full">
                <h1 class="text-lg font-semibold">Vehicles</h1>
                <div class="flex flex-col gap-1 flex-initial">
                    {#if player.vehicles.length === 0}
                        This player has no vehicles
                    {:else}
                        {#each player.vehicles as vehicle}
                            <div
                                class="p-3 bg-neutral-700 rounded-md w-full flex gap-3 items-center h-full text-sm"
                            >
                                <span class="text-lg">{vehicle.vehicle}</span>
                                <span>Plate: {vehicle.plate}</span>
                                <span>
                                    State: {vehicle.state == 1 ? "IN" : "OUT"}
                                </span>
                                <button
                                    class="ml-auto bg-neutral-600 p-1 rounded-md hover:bg-neutral-400 active:bg-neutral-500 transition-colors duration-150"
                                    on:click={() =>
                                        fetchNui(
                                            "iggy-admin:spawnPlayerVehicle",
                                            {
                                                event: "iggy-admin:server:spawnPlayerVehicle",
                                                data: {
                                                    values: {
                                                        ["plate"]:
                                                            vehicle.plate,
                                                    },
                                                },
                                                type: "SERVER",
                                            }
                                        )}
                                >
                                    Spawn
                                </button>
                            </div>
                        {/each}
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>
