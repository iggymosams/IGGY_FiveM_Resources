<script lang="ts">
    import Icon from "@iconify/svelte";
    import { fetchNui } from "../../utils/fetchNui";
    import NavButtons from "./NavButtons.svelte";

    export let dev: boolean;
    export let expanded: boolean;
    export let tab: string;

    function toggleDev() {
        dev = !dev;
        fetchNui("iggy-admin:toggleDev");
    }

    function toggleExpanded() {
        expanded = !expanded;
    }
</script>

<div class="w-10 h-full bg-neutral-800 p-1 flex flex-col yy flex-none">
    <button
        class="w-full rounded-md border border-white text-white"
        on:click|preventDefault={toggleExpanded}
    >
        {#if expanded}
            <Icon icon="mingcute:right-fill" class="w-full h-full" />
        {:else}
            <Icon icon="mingcute:left-fill" class="w-full h-full" />
        {/if}
    </button>
    <div class="my-auto flex gap-1 flex-col">
        <NavButtons bind:selected={tab} />
    </div>
    <button
        class={`w-full rounded-md border border-white text-white transition-colors duration-150 ${
            dev ? "bg-rose-600" : ""
        }`}
        on:click|preventDefault={toggleDev}
    >
        <Icon icon="mdi:terminal-line" class="w-full h-full" />
    </button>
</div>
