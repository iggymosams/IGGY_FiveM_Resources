<script lang="ts">
    import type { AdminPlayerData } from "../../../types/types";
    import { fetchNui } from "../../../utils/fetchNui";
    import PlayerAccordian from "./PlayerAccordian.svelte";

    let players: AdminPlayerData[] = [];

    let filteredPlayers: AdminPlayerData[] = [];
    let serverIdFilter: string = "";
    let steamFilter: string = "";

    fetchNui("iggy-admin:getPlayersData")
        .then((data) => (players = data))
        .catch(() => {
            players = [
                {
                    serverId: 1,
                    steam: "steam:2100001123a30f6",
                    username: "iggymosams",
                    identifiers: [],
                    charInfo: {
                        bank: 100,
                        cash: 100,
                        crypto: 100,
                        cid: "1",
                        gang: "",
                        job: "",
                        name: "",
                        phone: 1234567890,
                    },
                    vehicles: [],
                    loggedIn: false,
                },
                {
                    serverId: 2,
                    steam: "steam:3100001123a30f6",
                    username: "iggymosams",
                    identifiers: [],
                    charInfo: {
                        bank: 100,
                        cash: 100,
                        crypto: 100,
                        cid: "1",
                        gang: "",
                        job: "",
                        name: "",
                        phone: 1234567890,
                    },
                    vehicles: [],
                    loggedIn: false,
                },
                {
                    serverId: 3,
                    steam: "steam:4100001123a30f6",
                    username: "iggymosams",
                    identifiers: [],
                    charInfo: {
                        bank: 100,
                        cash: 100,
                        crypto: 100,
                        cid: "1",
                        gang: "",
                        job: "",
                        name: "",
                        phone: 1234567890,
                    },
                    vehicles: [],
                    loggedIn: false,
                },
                {
                    serverId: 4,
                    steam: "steam:1100001123a30f6",
                    username: "iggymosams",
                    identifiers: [],
                    charInfo: {
                        bank: 100,
                        cash: 100,
                        crypto: 100,
                        cid: "1",
                        gang: "",
                        job: "",
                        name: "",
                        phone: 1234567890,
                    },
                    vehicles: [],
                    loggedIn: false,
                },
            ];
        });

    function filterPlayers(
        plrs: AdminPlayerData[],
        sid: string,
        steam: string
    ) {
        console.log(1);
        filteredPlayers = plrs.filter(
            (plr) =>
                plr.serverId.toString().includes(sid) &&
                plr.steam.includes(steam)
        );
    }

    $: filterPlayers(players, serverIdFilter, steamFilter);
</script>

<div class="w-full h-full text-white flex flex-col">
    <div class="flex w-full">
        <input
            class="w-1/2 bg-neutral-700"
            placeholder="Search Server Id"
            bind:value={serverIdFilter}
        />
        <input
            class="w-1/2 bg-neutral-700"
            placeholder="Search Steam Id"
            bind:value={steamFilter}
        />
    </div>
    <div class="w-full grid grid-cols-7 bg-neutral-700">
        <span class="col-span-1">Source</span>
        <span class="col-span-3">Name</span>

        <span class="col-span-3">Steam</span>
    </div>
    <div class="flex-grow w-full overflow-auto">
        {#each filteredPlayers as player}
            <PlayerAccordian {player} />
        {/each}
    </div>
</div>
