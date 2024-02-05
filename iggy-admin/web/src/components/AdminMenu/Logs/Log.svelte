<script lang="ts">
    import type { Log } from "../../../types/types";

    export let log: Log;
    export let expanded: boolean = false;
    export let even: boolean;
</script>

<div
    class={`grid grid-cols-${expanded ? "6" : "3"} ${
        even ? "bg-neutral-900" : "bg-neutral-800 "
    }`}
>
    <span class="col-span-1">{log.source}</span>
    <span class="col-span-1">{log.type}</span>
    {#if expanded}
        <span class="col-span-3">{log.message}</span>
    {/if}
    <span class="col-span-1">
        {new Date(log.date).toLocaleString("en-GB", {
            dateStyle: "short",
            timeStyle: "short",
        })}
    </span>
</div>
