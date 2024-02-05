<script lang="ts">
    import type { SMCommand, SMOpenData } from "../../types/types";
    import SelectionMenuButton from "./SelectionMenuButton.svelte";
    import { useNuiEvent } from "../../utils/useNuiEvent";
    import { fetchNui } from "../../utils/fetchNui";
    import { onMount } from "svelte";
    let open = false;
    let type = "";
    let commands: SMCommand[] = [];

    useNuiEvent<SMOpenData>("openSelectionMenu", (data) => {
        open = data.open;
        commands = data.commands;
        type = data.type;
    });

    onMount(() => {
        const keyHandler = (e: KeyboardEvent) => {
            if (open && ["Escape"].includes(e.code)) {
                fetchNui("iggy-admin:closeSMMenu");
                open = false;
            }
        };

        window.addEventListener("keydown", keyHandler);

        return () => window.removeEventListener("keydown", keyHandler);
    });
</script>

{#if open}
    <div
        class="absolute left-[55%] top-1/2 bg-neutral-900 w-1/6 rounded-md overflow-hidden text-white"
    >
        <div class="w-full text-center p-1">{type} MENU</div>
        {#each commands as command}
            <SelectionMenuButton name={command.name} event={command.event} />
        {/each}
    </div>
{/if}
