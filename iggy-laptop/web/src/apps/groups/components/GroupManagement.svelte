<script lang="ts">
    import { group, isGroupHost, requests } from "../../../store/groups";
    import { fetchNui } from "../../../utils/fetchNui";
    import { useNuiEvent } from "../../../utils/useNuiEvent";

    useNuiEvent<string[]>("groups", "updateRequests", (data) => {
        requests.set(data);
    });
</script>

<div class="w-full h-full p-16">
    {#if !$group}
        <div>Loading</div>
    {:else}
        <div class="h-[10%] flex w-full items-center">
            <h1 class="text-3xl font-bold text-white">
                {$isGroupHost ? "Your" : `${$group.leader}'s`} Group
            </h1>
            <button
                class="ml-auto p-1 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:bg-opacity-25 h-min"
                on:click={() => fetchNui("groups:leaveGroup")}
            >
                Leave Group
            </button>
        </div>
        <div class="flex w-full h-[90%] gap-3">
            <div class="pb-3 overflow-auto h-full w-full rounded-md relative">
                <div class="flex flex-col absolute w-full h-full gap-3">
                    {#each $group.players as player}
                        <div
                            class=" text-white w-full rounded-lg p-4 flex items-center gap-3 bg-zinc-700"
                        >
                            <h1 class="font-bold text-3xl">
                                {player}
                            </h1>
                            {#if $isGroupHost}
                                <div class="ml-auto">
                                    <button
                                        class="h-min py-2 px-4 rounded-md border border-red-500 text-red-500 hover:bg-red-400 hover:bg-opacity-25"
                                        on:click={() =>
                                            fetchNui(
                                                "groups:promotePlayer",
                                                player
                                            )}
                                    >
                                        Promote
                                    </button>
                                    <button
                                        class="h-min py-2 px-4 rounded-md border border-red-500 text-red-500 hover:bg-red-400 hover:bg-opacity-25"
                                        on:click={() =>
                                            fetchNui(
                                                "groups:kickPlayer",
                                                player
                                            )}
                                    >
                                        Kick
                                    </button>
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
            <div class="pb-3 overflow-auto h-full w-full rounded-md relative">
                <div class="flex flex-col absolute w-full gap-3">
                    {#each $requests as request}
                        <div
                            class="bg-zinc-700 text-white h-min w-full rounded-lg p-4 flex items-center gap-3"
                        >
                            <h1 class="font-bold text-3xl">
                                {request}
                            </h1>
                            <button
                                class="ml-auto h-min py-2 px-4 rounded-md border border-green-500 text-green-500 hover:bg-green-400 hover:bg-opacity-25"
                                on:click={() =>
                                    fetchNui("groups:acceptRequest", request)}
                            >
                                Accept
                            </button>
                            <button
                                class="p-1 h-min py-2 px-4 rounded-md border border-red-500 text-red-500 hover:bg-red-400 hover:bg-opacity-25"
                                on:click={() =>
                                    fetchNui("groups:rejectRequest", request)}
                            >
                                Reject
                            </button>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    {/if}
</div>
