<script lang="ts">
    import Icon from "@iconify/svelte";
    import { useNuiEvent } from "../../utils/useNuiEvent";
    import ContractCard from "./ContractCard.svelte";
    import { debugData } from "../../utils/debugData";
    import { fetchNui } from "../../utils/fetchNui";
    import type { Contract, Rep, RunningContract } from "./types";
    let rep: Rep;
    let contracts: Contract[] = [];

    let inGroup: boolean = false;
    let isReady: boolean = false;

    let activeContract: RunningContract;

    fetchNui("boosting:getRep")
        .then((data) => {
            rep = data;
            console.log(((rep.xp - rep.min) / (rep.max - rep.min)) * 100, "%");
        })
        .catch(() => {
            rep = {
                level: "A",
                xp: 100,
                max: 100,
                min: 0,
            };
        });

    fetchNui("boosting:getInGroup").then((data) => {
        inGroup = data.inGroup;
        isReady = data.isReady;
    });

    fetchNui("boosting:getContracts").then((data) => {
        contracts = data.contracts;
        activeContract = data.active;
    });

    useNuiEvent<Rep>("boosting", "updateRep", (newRep) => {
        console.log(newRep);
        rep = newRep;
        console.log(((rep.xp - rep.min) / (rep.max - rep.min)) * 100, "%");
    });

    useNuiEvent<Contract>("boosting", "newContract", (contract) => {
        contracts = [...contracts, contract];
    });

    useNuiEvent<Number>("boosting", "removeContract", (id) => {
        contracts = contracts.filter((contract) => contract.id !== id);
    });

    useNuiEvent<RunningContract>(
        "boosting",
        "updateActiveContract",
        (contract) => {
            activeContract = contract;
        }
    );

    useNuiEvent<boolean>("boosting", "updateInGroup", (data) => {
        inGroup = data;
        console.log(inGroup, data);
    });

    debugData([
        {
            app: "boosting",
            action: "updateRep",
            data: {
                level: "A",
                xp: 100,
                max: 100,
            },
        },
    ]);

    debugData(
        [
            {
                app: "boosting",
                action: "newContract",
                data: {
                    class: "A",
                    model: "adder",
                    name: "Adder",
                    rewardRep: 1,
                    cost: 1,
                    rewardCrypto: 1,
                    time: generateFutureTimestamp(0, 30),
                    playerCid: "A",
                    id: 1,
                },
            },
        ],
        2000
    );

    function generateFutureTimestamp(
        hoursFromNow: number,
        minutesFromNow: number
    ): number {
        const futureTime = new Date();
        futureTime.setHours(futureTime.getHours() + hoursFromNow);
        futureTime.setMinutes(futureTime.getMinutes() + minutesFromNow);

        return Math.floor(futureTime.getTime() / 1000);
    }

    function toggleReady() {
        isReady = !isReady;
        fetchNui("boosting:toggleReady", isReady);
    }
</script>

<div class="w-full h-full px-10 py-3 text-white">
    <div class="h-full w-full flex flex-col gap-3">
        <h1 class="w-full text-center text-3xl font-bold faded-border p-1">
            Boosting
        </h1>
        <h2 class="text-7xl w-full text-center font-black">
            {rep ? rep.level : "Loading"}
        </h2>
        <div
            class="w-full h-4 bg-black rounded-full overflow-hidden"
            id="progressbar"
        >
            <div
                class={`h-full bg-gradient-to-l to-red-500 from-green-400 bg-fixed`}
                style={`width: ${
                    rep ? ((rep.xp - rep.min) / (rep.max - rep.min)) * 100 : 0
                }%`}
                id="bar"
            />
        </div>

        <div class="w-full flex flex-col flex-auto overflow-y-auto gap-1">
            {#if isReady}
                {#if contracts.length !== 0 || activeContract}
                    {#if activeContract}
                        <ContractCard
                            vehClass={activeContract.class}
                            name={activeContract.contract.name}
                            cost={activeContract.contract.cost}
                            reward={activeContract.contract.rewardCrypto}
                            time={activeContract.contract.time}
                            id={activeContract.id}
                            active
                            plate={activeContract.plate}
                        />
                    {/if}
                    {#each contracts as contract}
                        <ContractCard
                            vehClass={contract.class}
                            name={contract.name}
                            cost={contract.cost}
                            reward={contract.rewardCrypto}
                            time={contract.time}
                            id={contract.id}
                            disabled={!inGroup}
                        />
                    {/each}
                {:else}
                    <h1
                        class="w-full h-full text-4xl font-bold text-center content-center"
                    >
                        Waiting For Contracts
                    </h1>
                {/if}
            {:else}
                <button
                    class="bg-neutral-400 p-3 w-1/3 rounded-lg hover:bg-neutral-500 text-black self-center"
                    on:click|preventDefault={toggleReady}
                    >Join Contract Queue</button
                >
            {/if}
        </div>

        <div class="w-full flex justify-center gap-2">
            {#if isReady}
                <button
                    class="bg-neutral-400 py-1 w-1/6 self-center text-black"
                    on:click|preventDefault={toggleReady}>Leave Queue</button
                >
            {/if}
        </div>
    </div>
</div>

<style>
    .faded-border {
        position: relative;
    }

    .faded-border::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.8) 45%,
            rgba(255, 255, 255, 0.8) 55%,
            rgba(255, 255, 255, 0) 100%
        );
    }
</style>
