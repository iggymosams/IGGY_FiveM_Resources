<script lang="ts">
    import { onMount } from "svelte";
    import { fetchNui } from "../../../utils/fetchNui";
    import { activeTab, tabs } from "../../../store/ridge";
    import { Pencil, Save, Settings } from "lucide-svelte";
    import type { PageData } from "../types";
    import { fly } from "svelte/transition";

    export let pageData: PageData;

    let isOwner = false;
    let open = false;

    onMount(async () => {
        try {
            let owner = await fetchNui("ridge:isSiteOwner", $activeTab.url);
            isOwner = owner;
        } catch (error) {
            isOwner = true;
        }
    });

    function saveData() {
        let tabId = $activeTab.id;

        tabs.update((currentTabs) => {
            let i = currentTabs.findIndex((t) => t.id === tabId);

            currentTabs[i].page.data = pageData;

            return currentTabs;
        });
        activeTab.set($tabs.find((t) => t.id === tabId) || $tabs[0]);
        fetchNui("ridge:saveSite", { pageData: pageData, tab: $activeTab });
    }
</script>

<slot />
{#if isOwner}
    <div
        class="absolute bottom-0 right-0 p-5 w-min flex flex-row-reverse gap-2"
    >
        <button
            class="p-3 bg-orange-600 rounded-full shadow-lg text-white hover:bg-orange-500"
            on:click={() => {
                open = !open;
            }}
        >
            <Pencil />
        </button>
        <div class="flex flex-row-reverse gap-1">
            {#if open}
                <button
                    class="p-3 bg-orange-400 rounded-full shadow-lg text-white hover:bg-orange-500"
                    on:click={() => {
                        $activeTab.editing = !$activeTab.editing;
                        if (!$activeTab.editing) saveData();
                    }}
                    transition:fly={{ x: 15, delay: 200 }}
                >
                    {#if $activeTab.editing}
                        <Save />
                    {:else}
                        <Pencil />
                    {/if}
                </button>
                <!-- TODO: Site Settings -->
                <button
                    class="p-3 bg-orange-400 rounded-full shadow-lg text-white hover:bg-orange-500"
                    on:click={() => {}}
                    transition:fly={{ x: 15, delay: 150 }}
                >
                    <Settings />
                </button>
            {/if}
        </div>
    </div>
{/if}
