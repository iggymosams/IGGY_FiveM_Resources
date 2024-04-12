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
    import { activeTab, tabs } from "../../../store/ridge";
    import HomePage from "./HomePage.svelte";

    function randomID() {
        return (
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
        );
    }

    function newTab() {
        tabs.update((currentTabs) => [
            ...currentTabs,
            {
                title: "New tab",
                id: randomID(),
                page: { content: HomePage },
            },
        ]);
    activeTab.subscribe((newActive) => {
        if (newActive === undefined) return;
        if (newActive.url) {
            url = newActive.url;
        } else {
            url = "";
        }
    });
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
            />
        </div>
        <ToolbarButton>
            <Menu class="text-neutral-400" />
        </ToolbarButton>
    </div>
</div>
