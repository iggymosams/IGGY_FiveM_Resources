<script lang="ts">
    import type { Log as LogType } from "../../../types/types";
    import Log from "./Log.svelte";
    import { fetchNui } from "../../../utils/fetchNui";
    import { log } from "three/examples/jsm/nodes/Nodes.js";

    let logs: LogType[] = [];

    export let expanded: boolean;

    let filteredLogs: LogType[] = [];
    let typeFilter: string = "";
    let messageFilter: string = "";

    fetchNui("iggy-admin:getLogs")
        .then((data) => (logs = data))
        .catch(
            () =>
                (logs = [
                    {
                        source: "banking",
                        message: "iggymosams Withdrawal $100000 (police)",
                        type: "Withdraw Money",
                        date: 1659645355000.0,
                        id: 1,
                    },
                    {
                        source: "playermoney",
                        message:
                            "**iggymosams (citizenid: DIE35423 | id: 3)** $100000 (cash) added, new cash balance: 9410308 reason: Boss menu withdraw",
                        type: "AddMoney",
                        date: 1659645355000.0,
                        id: 2,
                    },
                    {
                        source: "playermoney",
                        message:
                            "**notme (citizenid: DIE35423 | id: 3)** $150 (bank) added, new bank balance: 9290 reason: unknown",
                        type: "AddMoney",
                        date: 1659645378000.0,
                        id: 3,
                    },
                ])
        );

    function filterLogs(newLogs: LogType[], type: string, message: string) {
        filteredLogs = newLogs.filter(
            (log) => log.type.includes(type) && log.message.includes(message)
        );
    }

    $: filterLogs(logs, typeFilter, messageFilter);
</script>

<div class="w-full h-full text-white text-xs flex flex-col">
    <div class="flex w-full">
        <input
            class="w-1/2 bg-neutral-700"
            placeholder="Search Type"
            bind:value={typeFilter}
        />
        <input
            class="w-1/2 bg-neutral-700"
            placeholder="Search Message"
            bind:value={messageFilter}
        />
    </div>
    <div
        class={`w-full grid  ${
            expanded ? "grid-cols-6" : "grid-cols-3"
        } bg-neutral-700`}
    >
        <span class="col-span-1">Source</span>
        <span class="col-span-1">Type</span>
        {#if expanded}
            <span class="col-span-3">Message</span>
        {/if}
        <span class="col-span-1">Date</span>
    </div>
    <div class="flex-grow w-full overflow-auto">
        {#each filteredLogs as log, index}
            <Log {expanded} {log} even={index % 2 === 0} />
        {/each}
    </div>
</div>
