<script lang="ts">
    import { Mountain, X } from "lucide-svelte";
    import { slide } from "svelte/transition";
    import type { Tab } from "../types";
    import { activeTab, tabs } from "../../../store/ridge";

    export let tab: Tab;
</script>

<button
    class={`p-1 ${$activeTab.id === tab.id ? "bg-neutral-600" : "bg-neutral-700 "} rounded-t-lg text-nowrap min-w-28 w-52 flex items-center gap-1 overflow-hidden transition-colors hover:bg-neutral-600`}
    in:slide={{ axis: "x", duration: 250 }}
    out:slide={{ axis: "x", duration: 250 }}
    on:click={() => ($activeTab = tab)}
>
    <Mountain size={20} class="text-orange-400" />
    <span class="overflow-hidden text-nowrap">{tab.title}</span>
    <button
        class="ml-auto rounded-md hover:bg-neutral-500 aspect-square"
        on:click={() => {
            tabs.update((currentTabs) => {
                return currentTabs.filter((t) => t.id !== tab.id);
            });
        }}
    >
        <X size={20} />
    </button>
</button>
