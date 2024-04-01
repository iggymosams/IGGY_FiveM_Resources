<script lang="ts">
    import { onMount } from "svelte";
    import type { ActiveContract, Contract } from "../types";
    import ClassIcon from "./ClassIcon.svelte";
    import TimeRemaining from "./TimeRemaining.svelte";
    import { fetchNui } from "../../../utils/fetchNui";

    export let contract: Contract | ActiveContract;

    let isActive = false;
    let expired = false;

    function isActiveContract(
        contract: Contract | ActiveContract
    ): contract is ActiveContract {
        return (contract as ActiveContract).plate !== undefined;
    }

    onMount(() => {
        isActive = isActiveContract(contract);
    });
</script>

{#if !expired}
    <div
        class={`h-20 w-full rounded-full flex-none outline outline-2  ${
            isActive ? "outline-green-500" : "outline-neutral-400"
        } p-1 text-left transition-[background-color_outline-color]`}
    >
        <div class="w-full h-full grid grid-cols-8 items-center">
            <div class="col-span-1 h-full flex items-center">
                <ClassIcon vehClass={contract.class} />
            </div>
            <div>
                <div class="font-bold text-2xl">{contract.name}</div>
                <div>
                    Reward:
                    <span class="text-sky-500 font-semibold">
                        {contract.rewardCrypto} qbit
                    </span>
                </div>
            </div>
            <div class="col-span-3 col-start-4">
                {#if isActiveContract(contract)}
                    <div>
                        Plate:
                        <span class="text-sky-500 font-semibold">
                            {contract.plate}
                        </span>
                    </div>
                {:else}
                    <TimeRemaining time={contract.time} bind:expired />
                    <div>
                        Cost:
                        <span class="text-sky-500 font-semibold">
                            {contract.cost} qbit
                        </span>
                    </div>
                {/if}
            </div>
            <button
                class={`${
                    isActive
                        ? "bg-green-500"
                        : "bg-sky-700 active:scale-95 hover:bg-sky-600"
                }  rounded-full p-3 px-4 h-full col-start-8 transition-all duration-150`}
                on:click={() => fetchNui("boosting:startContract", contract.id)}
            >
                {isActive ? "Active Contract" : "Accept Contract"}
            </button>
        </div>
    </div>
{/if}
