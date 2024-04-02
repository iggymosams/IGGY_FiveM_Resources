<script lang="ts">
    import { onMount } from "svelte";
    import AppShell from "../../../components/AppShell.svelte";
    import {
        activeContract,
        contracts,
        inQueue,
        rep,
    } from "../../../store/boosting";
    import type { LaptopApp } from "../../../utils/apps";
    import RepBar from "./RepBar.svelte";
    import { fetchNui } from "../../../utils/fetchNui";
    import type { ActiveContract, Contract, Rep } from "../types";
    import { useNuiEvent } from "../../../utils/useNuiEvent";
    import { debugData } from "../../../utils/debugData";
    import Header from "./Header.svelte";
    import ContractCard from "./ContractCard.svelte";

    export let app: LaptopApp;

    useNuiEvent<Rep>("boosting", "updateRep", (data) => {
        rep.set(data);
    });

    useNuiEvent<Contract[]>("boosting", "updateContracts", (data) => {
        contracts.set(data);
    });

    useNuiEvent<boolean>("boosting", "toggleQueue", (data) => {
        inQueue.set(data);
    });

    useNuiEvent<ActiveContract>("boosting", "updateActiveContract", (data) => {
        activeContract.set(data);
    });

    onMount(() => {
        fetchNui("boosting:getInfo");
    });

    debugData([
        {
            app: "boosting",
            action: "updateRep",
            data: {
                level: "A",
                max: 200,
                min: 50,
                xp: 100,
            },
        },
    ]);
</script>

<AppShell {app} class="bg-neutral-800 px-10 text-white h-full">
    <Header />
    <RepBar rep={$rep} />
    <div class=" h-4/6 p-3">
        {#if $inQueue}
            <div class=" h-full overflow-auto rounded-md relative">
                <div
                    class="flex flex-col absolute top-0 left-0 w-full gap-3 py-1 px-1"
                >
                    {#if $activeContract}
                        <ContractCard contract={$activeContract} />
                    {/if}

                    {#each $contracts as contract}
                        <ContractCard {contract} />
                    {/each}
                </div>
            </div>
        {:else}
            <button
                class="bg-neutral-400 p-3 w-1/3 rounded-lg hover:bg-neutral-500 text-black self-center"
                on:click={() => fetchNui("boosting:toggleQueue")}
            >
                Join Contract Queue
            </button>
        {/if}
    </div>
</AppShell>
