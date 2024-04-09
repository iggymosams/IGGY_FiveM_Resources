<script lang="ts">
    import { writable } from "svelte/store";
    import TextEditor from "./TextEditor.svelte";
    import type { tab } from "../types";
    import { canEdit, laws } from "../../../store/government";
    import { fetchNui } from "../../../utils/fetchNui";

    function randomID() {
        return (
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
        );
    }

    let activeTab = writable<tab>($laws[0] ? $laws[0] : undefined);
    let editing = writable(false);

    let title = $laws[0] ? $laws[0].title : undefined;
    let getEditorContent: any;

    function newTab() {
        let tab: tab = {
            title: "New Tab",
            uuid: randomID(),
        };
        title = tab.title;
        activeTab.set(tab);
        laws.update(($laws) => [tab, ...$laws]);
        editing.set(true);
    }

    function toggleEditing() {
        if ($editing && title) {
            $activeTab.html = getEditorContent();
            $activeTab.title = title;
            const tabIdx = $laws.findIndex(
                (tab) => tab.uuid === $activeTab.uuid
            );
            if (tabIdx !== -1) {
                laws.update(($laws) => {
                    const updatedLaws = [...$laws];
                    updatedLaws[tabIdx] = $activeTab;
                    return updatedLaws;
                });
                fetchNui("gov:saveLaw", $activeTab);
            }
        }
        $editing = !$editing;
    }
</script>

<div
    class="text-left w-full h-full absolute top-0 left-0 px-16 overflow-auto py-3 flex flex-col"
>
    {#if $canEdit}
        <div class="w-full grid grid-cols-12 gap-2 pb-3">
            <input
                class="col-start-3 col-span-5 font-bold text-lg bg-transparent"
                bind:value={title}
                disabled={!$editing}
            />

            <button
                class="py-1 px-2 rounded-md bg-blue-400 hover:bg-blue-500 col-start-11"
                on:click={newTab}
            >
                New
            </button>
            <button
                class="py-1 px-2 rounded-md bg-blue-400 hover:bg-blue-500"
                on:click={toggleEditing}
            >
                {$editing ? "Save" : "Edit"}
            </button>
        </div>
    {/if}
    <div class="w-full h-full grid grid-cols-12 flex-auto">
        <div class="col-span-2 relative overflow-auto">
            <div class="divide-y divide-blue-400 px-1 overflow-hidden absolute">
                {#each $laws as tab, i}
                    <button
                        class="w-full py-5 px-1"
                        on:click={() => {
                            activeTab.set({ ...$laws[i] });
                            title = tab.title;
                        }}
                    >
                        {tab.title}
                    </button>
                {/each}
            </div>
        </div>
        <div class="col-span-10 h-full">
            <div class="h-full w-full bg-white rounded-md shadow-md">
                <TextEditor {activeTab} {editing} bind:getEditorContent />
            </div>
        </div>
    </div>
</div>
