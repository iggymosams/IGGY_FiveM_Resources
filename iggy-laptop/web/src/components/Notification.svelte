<script lang="ts">
    import Icon from "@iconify/svelte";
    import { blur, slide } from "svelte/transition";

    export let type: "ERROR" | "SUCCESS";
    export let message: string;
</script>

<div
    transition:slide={{ duration: 150 }}
    class={`w-full aspect-[10/1] ${
        type === "ERROR" ? "bg-red-400" : "bg-green-400"
    } rounded-md align-baseline flex items-center px-3 gap-3`}
>
    {#if type === "ERROR"}
        <Icon icon="material-symbols:error" class="text-2xl h-full" />
    {:else}
        <Icon icon="ep:success-filled" class="text-2xl h-full" />
    {/if}
    <span class="overflow-ellipsis">
        {message}
    </span>
</div>
