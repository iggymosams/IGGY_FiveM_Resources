<script lang="ts">
    import exp from "constants";
    import { onDestroy, onMount } from "svelte";
    import { writable } from "svelte/store";
    import type { VehicleClass } from "./types";
    import { blur } from "svelte/transition";
    import ContractClassIcon from "./ContractClassIcon.svelte";
    import { fetchNui } from "../../utils/fetchNui";

    export let vehClass: VehicleClass;
    export let name: string;
    export let reward: number;
    export let time: number;
    export let cost: number;
    export let id: number;
    export let active = false;
    export let plate: string | undefined = undefined;
    let expired = false;

    const timeRemaining = writable("");

    function calculateTimeRemaining(timestamp: number): string {
        const currentTime = Math.floor(Date.now() / 1000);
        const remainingTimeInSeconds = Math.max(0, timestamp - currentTime);

        const hours = Math.floor(remainingTimeInSeconds / 3600);
        const minutes = Math.floor((remainingTimeInSeconds % 3600) / 60);
        const seconds = remainingTimeInSeconds % 60;
        expired = Date.now() / 1000 > time;

        if (hours > 0) {
            return `${hours} hour(s) ${minutes} minute(s)`;
        } else if (minutes > 0) {
            return `${minutes} minute(s) ${seconds} second(s)`;
        } else {
            return `${seconds} second(s)`;
        }
    }

    let intervalId: string | number | NodeJS.Timer | undefined;

    onMount(() => {
        timeRemaining.set(calculateTimeRemaining(time));

        intervalId = setInterval(() => {
            timeRemaining.set(calculateTimeRemaining(time));
        }, 1000);
    });

    onDestroy(() => {
        clearInterval(intervalId);
    });

    function acceptContract() {
        fetchNui("boosting:acceptContract", id);
    }
</script>

{#if !expired}
    <div
        class={`h-1/6 w-full rounded-full flex-none border-2 ${
            active ? "border-green-500" : "border-neutral-400"
        } `}
    >
        <div class=" w-full flex h-full items-center p-1">
            <div class="flex h-full gap-3 w-4/12 items-center">
                <ContractClassIcon {vehClass} />
                <div>
                    <div class="font-bold text-2xl">{name}</div>
                    <div>
                        Reward:
                        <span class="text-sky-500 font-semibold">
                            {reward} qbit
                        </span>
                    </div>
                </div>
            </div>
            <div class="w-4/12">
                {#if !active}
                    <div>
                        Time Remaining:
                        <span class="text-sky-500 font-semibold">
                            {$timeRemaining}
                        </span>
                    </div>
                    <div>
                        Cost:
                        <span class="text-sky-500 font-semibold">
                            {cost} qbit
                        </span>
                    </div>
                {:else if active && plate}
                    <div>
                        Plate:
                        <span class="text-sky-500 font-semibold">
                            {plate}
                        </span>
                    </div>
                {/if}
            </div>
            <button
                class={`${
                    active ? "bg-green-500" : "bg-sky-700 hover:bg-sky-600"
                } rounded-full p-3 px-4 ml-auto h-full  active:scale-95 transition-all duration-150`}
                on:click={acceptContract}
                disabled={active}
            >
                {active ? "Active Contract" : "Accept Contract"}
            </button>
        </div>
    </div>
{/if}
