<script lang="ts">
    import {
        ArrowLeft,
        ArrowRight,
        Menu,
        Plus,
        RotateCw,
        Search,
    } from "lucide-svelte";
    import ToolbarButton from "./ToolbarButton.svelte";
    import Tab from "./Tab.svelte";
    import { activeTab, progress, tabs } from "../../../store/ridge";
    import HomePage from "./HomePage.svelte";
    import { searchURL } from "../utils";
    import { randomID } from "../../../utils/misc";
    import { fade } from "svelte/transition";

    let url: string = "";
    let searchInput: HTMLInputElement;

    function newTab() {
        tabs.update((currentTabs) => [
            ...currentTabs,
            {
                title: "New tab",
                id: randomID(),
                page: { content: HomePage },
            },
        ]);
        activeTab.set($tabs[$tabs.length - 1]);
    }

    activeTab.subscribe((newActive) => {
        if (newActive === undefined) return;
        if (newActive.url) {
            url = newActive.url;
        } else {
            url = "";
        }
    });

    function handleSearch(event: KeyboardEvent) {
        if (event.key === "Enter") {
            searchURL(url, $activeTab.id);
            searchInput.blur();
        }
    }
</script>

<div class="w-full bg-neutral-700 h-20">
    <div class="w-full h-2/5 pt-1 px-1 gap-1 text-neutral-200 flex">
        <div class="flex gap-1 grow-1 overflow-auto">
            {#each $tabs as tab (tab)}
                <Tab {tab} />
            {/each}
        </div>
        <ToolbarButton on:click={newTab}>
            <Plus />
        </ToolbarButton>
    </div>
    <div class="w-full h-3/5 flex items-center px-3 py-1 gap-2">
        <div class="flex gap-1 text-neutral-400">
            <ToolbarButton>
                <ArrowLeft />
            </ToolbarButton>
            <ToolbarButton>
                <ArrowRight />
            </ToolbarButton>
            <ToolbarButton>
                <RotateCw />
            </ToolbarButton>
        </div>
        <div
            class="w-full bg-neutral-600 rounded-full text-white p-1 flex items-center focus-within:outline focus-within:outline-2 focus-within:outline-orange-400"
        >
            <Search />
            <input
                class="bg-transparent w-full px-3 focus:outline-none"
                placeholder="Search or go anywhere..."
                bind:value={url}
                on:keydown={handleSearch}
                bind:this={searchInput}
            />
        </div>
        <ToolbarButton>
            <Menu class="text-neutral-400" />
        </ToolbarButton>
    </div>
    {#if $progress !== 0}
        <div class={"w-full h-0.5 absolute"} transition:fade>
            <div
                class="bg-orange-400 h-full transition-[width]"
                style={`width: ${$progress}%;`}
            />
        </div>
    {/if}
</div>
