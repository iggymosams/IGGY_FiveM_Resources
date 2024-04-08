<script lang="ts">
    import { writable } from "svelte/store";
    import TextEditor from "./TextEditor.svelte";
    import type { tab } from "../types";
    import { canEdit } from "../../../store/government";

    function randomID() {
        return (
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
        );
    }

    let tabs: tab[] = [
        {
            title: "The Constitution of San Andreas",
            html: "<p>dasdadasd</p><p><br></p><h1>Test</h1>",
            uuid: randomID(),
        },
    ];

    let activeTab = writable<tab>(tabs[0]);
    let editing = writable(false);

    let title = tabs[0].title;
    let getEditorContent: any;

    function newTab() {
        let tab: tab = {
            title: "New Tab",
            uuid: randomID(),
        };
        title = tab.title;
        $activeTab = tab;
        tabs.push(tab);
        $editing = true;
    }

    function toggleEditing() {
        if ($editing) {
            $activeTab.html = getEditorContent();
            $activeTab.title = title;
            let tab = tabs.findIndex((tab) => {
                tab.uuid === $activeTab.uuid;
            });
            tabs[tab] = $activeTab;
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
                {#each tabs as tab}
                    <button
                        class="w-full py-5 px-1"
                        on:click={() => {
                            $activeTab = tab;
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
