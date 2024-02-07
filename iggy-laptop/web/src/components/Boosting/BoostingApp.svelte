<script lang="ts">
    import Icon from "@iconify/svelte";
    import { useNuiEvent } from "../../utils/useNuiEvent";
    import ContractCard from "./ContractCard.svelte";
    import { debugData } from "../../utils/debugData";
    import { fetchNui } from "../../utils/fetchNui";
    import type { Contract, Rep, RunningContract } from "./types";
    import RepBar from "./RepBar.svelte";
    import { fade } from "svelte/transition";

    let rep: Rep;
    let contracts: Contract[] = [];

    let inGroup: boolean = false;
    let isReady: boolean = false;

    let activeContract: RunningContract;

    let creatingHandle = false;
    let createdHandle = "";
    let creatingHandleLoading = false;
    let creatingHandleErr = false;
    let creatingHandleErrMsg = "";

    let handle = "";
    let qbit = 0;

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

    fetchNui("boosting:getPlayer").then((data) => {
        handle = data.handle;
        qbit = data.qbit;
        creatingHandle = data.createHandle;
        console.log(creatingHandle);
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

    useNuiEvent("boosting", "createHandle", () => {
        creatingHandle = true;
    });

    useNuiEvent<string>("boosting", "createdHandle", (newHandle) => {
        creatingHandle = false;
        handle = newHandle;
    });

    useNuiEvent<string>("boosting", "failedCreatingHandle", (newHandle) => {
        creatingHandleErrMsg = "That handle is already taken.";
        creatingHandleErr = true;
        creatingHandleLoading = false;
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

{#if creatingHandle}
    <div
        class="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50"
        transition:fade
    >
        <div class="w-1/3 bg-neutral-800 rounded-lg p-8 text-white">
            <h2 class="text-2xl font-bold mb-4">Create Your Handle</h2>
            <p class="text-neutral-300 mb-4">
                Welcome to boosting. To get started enter your handle below:
            </p>
            <input
                type="text"
                placeholder="Enter your handle"
                class={`w-full border ${
                    creatingHandleErr
                        ? "border-2 border-red-500"
                        : "border-gray-300"
                }  rounded-lg py-2 px-4 focus:outline-none focus:border-blue-400 text-black`}
                bind:value={createdHandle}
                maxlength={25}
                minlength={3}
                disabled={creatingHandleLoading}
            />
            <div class="text-xs text-red-500">
                {creatingHandleErrMsg}
            </div>
            <button
                class="bg-blue-400 mt-4 py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300"
                on:click={() => {
                    if (
                        createdHandle.length >= 3 &&
                        createdHandle.length <= 25
                    ) {
                        fetchNui("boosting:createHandle", createdHandle);
                        creatingHandleLoading = true;
                    } else {
                        creatingHandleErrMsg =
                            "Handle must be between 3 and 25 characters long.";
                        creatingHandleErr = true;
                    }
                }}
                disabled={creatingHandleLoading}
            >
                {creatingHandleLoading ? "Loading " : "Submit"}
            </button>
        </div>
    </div>
{/if}

<div class="w-full h-full px-10 py-3 text-white">
    <div class="h-full w-full flex flex-col gap-3">
        <div
            class="w-full text-center text-3xl faded-border p-1 flex gap-4 items-center px-10"
        >
            <button class="bg-neutral-500 bg-opacity-25 p-2">
                Your Contracts
            </button>
            <!-- <button class="bg-neutral-700 opacity-25 p-2" disabled>
                Buy Contracts (Soon<sup>TM</sup>)
            </button> -->
            <span>{qbit} Qbit</span>
            <span class="font-bold ml-auto"
                >{handle !== undefined ? handle : ""}</span
            >
        </div>
        <RepBar {rep} />
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
                >
                    Join Contract Queue
                </button>
            {/if}
        </div>

        <div class="w-full flex justify-center gap-2">
            {#if isReady}
                <button
                    class="bg-neutral-400 py-1 w-1/6 self-center text-black"
                    on:click|preventDefault={toggleReady}
                >
                    Leave Queue.
                </button>
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
