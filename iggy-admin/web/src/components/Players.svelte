<script lang="ts">
    import type { AdminPlayerData } from "../types/types";
    import { fetchNui } from "../utils/fetchNui";
    import CommandButton from "./Options/CommandButton.svelte";
    import PlayerAccordian from "./PlayerAccordian.svelte";

    let players: AdminPlayerData[] = [];
    fetchNui("iggy-admin:getPlayersData")
        .then((data) => (players = data))
        .catch(() => {});
</script>

<div class="w-full h-1/6 flex-auto bg-white flex flex-col overflow-auto">
    <div class="w-full grid grid-cols-6">
        <span class="col-span-1">Server ID</span>
        <span class="col-span-2">Username</span>
        <span class="col-span-3">Steam</span>
        <!-- <span class="col-span-4">Quick Actions</span> -->
    </div>
    <div class="w-full h-full flex-auto">
        {#each players as player}
            <PlayerAccordian {player} />
            <!-- <div class="grid grid-cols-12 bg-slate-200">
                    <span class="col-span-1">1</span>
                    <span class="col-span-2">iggymosams</span>
                    <span class="col-span-4">steam:11000013445270b</span>
                    <span class="col-span-1">
                        <input type="checkbox" checked />
                    </span>
                    <span class="col-span-4">
                        <CommandButton
                            text="Kick Player"
                            actionData={{
                                event: "option.event",
                                data: {
                                    values: {},
                                    target: {
                                        display: "",
                                        id: "",
                                        name: "",
                                        serverId: "",
                                    },
                                },
                                type: "SERVER",
                                id: "id",
                            }}
                        />
                        <CommandButton
                            text="Ban Player"
                            actionData={{
                                event: "option.event",
                                data: {
                                    values: {},
                                    target: {
                                        display: "",
                                        id: "",
                                        name: "",
                                        serverId: "",
                                    },
                                },
                                type: "SERVER",
                                id: "id",
                            }}
                        />
                        <CommandButton
                            text="Goto Player"
                            actionData={{
                                event: "option.event",
                                data: {
                                    values: {},
                                    target: {
                                        display: "",
                                        id: "",
                                        name: "",
                                        serverId: "",
                                    },
                                },
                                type: "SERVER",
                                id: "id",
                            }}
                        />
                        <CommandButton
                            text="Bring Player"
                            actionData={{
                                event: "option.event",
                                data: {
                                    values: {},
                                    target: {
                                        display: "",
                                        id: "",
                                        name: "",
                                        serverId: "",
                                    },
                                },
                                type: "SERVER",
                                id: "id",
                            }}
                        />
                    </span>
                </div> -->
        {/each}
    </div>
</div>
