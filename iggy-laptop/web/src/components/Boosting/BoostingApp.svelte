<script lang="ts">
    import Icon from "@iconify/svelte";
    import { useNuiEvent } from "../../utils/useNuiEvent";
    import ContractCard from "./ContractCard.svelte";
    import { debugData } from "../../utils/debugData";
    import { fetchNui } from "../../utils/fetchNui";
    import type {
        Contract,
        Group,
        JoinRequest,
        Rep,
        RunningContract,
    } from "./types";
    import { slide } from "svelte/transition";

    let rep: Rep;
    let contracts: Contract[] = [];

    let inGroup: boolean = true;
    let groups: Group[] = [];
    let request: JoinRequest | undefined;

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

    fetchNui("boosting:getContracts").then((data) => {
        contracts = data.contracts;
        activeContract = data.active;
    });

    fetchNui("boosting:getGroups").then((data) => {
        inGroup = data.inGroup;
        request = data.request;
        isReady = data.isReady;
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

    useNuiEvent<Group[]>("boosting", "updateGroups", (newGroups) => {
        groups = newGroups;
    });

    useNuiEvent<JoinRequest>("boosting", "requestJoin", (newRequest) => {
        request = newRequest;
    });

    useNuiEvent("boosting", "joinedGroup", () => {
        inGroup = true;
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
                action: "requestJoin",
                data: {
                    name: "oliver",
                    cid: "abc",
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

    function createGroup() {
        fetchNui("boosting:createGroup");
        inGroup = true;
    }

    function joinGroup(id: number) {
        fetchNui("boosting:requestGroup", id);
    }

    function acceptRequest() {
        fetchNui("boosting:acceptRequest", request?.cid);
        request = undefined;
    }

    function denyRequest() {
        fetchNui("boosting:denyRequest", request?.cid);
        request = undefined;
    }

    function leaveGroup() {
        fetchNui("boosting:leaveGroup");
        inGroup = false;
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
        {#if inGroup}
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
            {#if request}
                <div
                    transition:slide={{ duration: 150 }}
                    class="w-1/3 absolute bottom-0 right-0 h-16 p-2 bg-neutral-400 text-black flex items-center gap-2 justify-evenly z-10 rounded-tl-lg"
                >
                    <span> {request.name} would like to join your group </span>
                    <button
                        class="aspect-square p-2 text-green-600 hover:text-green-500"
                        on:click|preventDefault={acceptRequest}
                    >
                        <Icon
                            icon="ep:success-filled"
                            class="text-4xl  w-full"
                        />
                    </button>
                    <button
                        class="aspect-square p-2 text-red-500 hover:text-red-400"
                        on:click|preventDefault={denyRequest}
                    >
                        <Icon
                            icon="ep:circle-close-filled"
                            class="text-4xl  w-full"
                        />
                    </button>
                </div>
            {/if}
            <div class="w-full flex justify-center gap-2">
                {#if isReady}
                    <button
                        class="bg-neutral-400 py-1 w-1/6 self-center text-black"
                        on:click|preventDefault={toggleReady}
                        >Leave Queue</button
                    >
                {/if}
                <button
                    class="bg-neutral-400 py-1 w-1/6 self-center text-black"
                    on:click|preventDefault={leaveGroup}>Leave Group</button
                >
            </div>
        {:else}
            <div
                class="flex-auto w-1/2 flex flex-col overflow-y-auto gap-1 self-center text-black text-lg"
            >
                <button
                    class="bg-neutral-400 p-3 w-full rounded-lg hover:bg-neutral-500"
                    on:click|preventDefault={createGroup}>Create Group</button
                >
                {#each groups as group}
                    <button
                        class="bg-neutral-400 p-3 w-full rounded-lg hover:bg-neutral-500"
                        on:click|preventDefault={() => joinGroup(group.id)}
                    >
                        {group.leaderName} ({1 +
                            group.players.length}/{group.maxSlots})
                    </button>
                {/each}
            </div>
        {/if}
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
