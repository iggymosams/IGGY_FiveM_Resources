<script lang="ts">
    import { onMount } from "svelte";
    import { fetchNui } from "../../../utils/fetchNui";
    import { activeTab, editing, tabs } from "../../../store/ridge";
    import { Pencil } from "lucide-svelte";
    import type { PageData } from "../types";

    export let pageData: PageData;

    let isOwner = false;

    onMount(async () => {
        $editing = false;
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
    <div class="absolute bottom-0 right-0 p-5 w-min">
        <button
            class="p-3 bg-orange-400 rounded-full shadow-lg text-white hover:bg-orange-500"
            on:click={() => {
                editing.set(!$editing);
                saveData();
            }}
        >
            <Pencil />
        </button>
    </div>
{/if}
