<script lang="ts">
    import type { Log } from "../types/types";
    import { fetchNui } from "../utils/fetchNui";

    let logs: Log[] = [];
    export let expanded: boolean;
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
                            "**iggymosams (citizenid: DIE35423 | id: 3)** $150 (bank) added, new bank balance: 9290 reason: unknown",
                        type: "AddMoney",
                        date: 1659645378000.0,
                        id: 3,
                    },
                ]),
        );
</script>

<div class="w-full h-1/6 flex-auto bg-white flex flex-col p-1 overflow-auto">
    {#if expanded}
        <div class="w-full grid grid-cols-12">
            <span class="col-span-1">Source</span>
            <span class="col-span-2">Type</span>
            <span class="col-span-8">Message</span>
            <span class="col-span-1">Date</span>
        </div>
        <div class="w-full h-full flex-auto">
            {#each logs as log}
                <div class="grid grid-cols-12 bg-slate-200">
                    <span class="col-span-1">{log.source}</span>
                    <span class="col-span-2">{log.type}</span>
                    <span class="col-span-8">{log.message}</span>
                    <span class="col-span-1"
                        >{new Date(log.date).toLocaleString("en-GB", {
                            dateStyle: "short",
                            timeStyle: "short",
                        })}</span
                    >
                </div>
            {/each}
        </div>
    {:else}
        <span class="w-full h-full text-center text-3xl">
            Expand menu to view logs
        </span>
    {/if}
</div>
