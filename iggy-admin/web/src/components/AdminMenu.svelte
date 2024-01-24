<script lang="ts">
    import { debugData } from "../utils/debugData";
    import Commands from "./Commands.svelte";
    import { useNuiEvent } from "../utils/useNuiEvent";
    import type { CommandGroup, OpenData } from "../types/types";
    import NavButtons from "./NavButtons.svelte";
    import Logs from "./Logs.svelte";
    import Options from "./Options.svelte";
    import Icon from "@iconify/svelte";
    import { onMount } from "svelte";
    import { fetchNui } from "../utils/fetchNui";

    let open: boolean = false;
    let dev: boolean = false;
    let expanded: boolean = false;

    let tab = "COMMANDS";

    let commands: CommandGroup[] = [];

    useNuiEvent<OpenData>("toggleAdminMenu", (data) => {
        open = data.open;
        commands = data.commands || [];
        dev = data.dev;
    });

    debugData([
        {
            action: "toggleAdminMenu",
            data: {
                open: true,
                commands: [
                    {
                        tab: "PLAYER",
                        commands: [
                            {
                                id: "noclip",
                                toggle: true,
                                collapse: false,
                                name: "No Clip",
                                active: false,
                                event: "test",
                                favourite: true,
                                type: "client",
                            },
                        ],
                    },
                    {
                        tab: "UTILITY",
                        commands: [
                            {
                                toggle: false,
                                id: "reviveTarget",
                                options: [
                                    {
                                        name: "Player",
                                        id: "player",
                                        type: "PLAYER_LIST",
                                    },
                                    {
                                        name: "Player",
                                        id: "playetr",
                                        type: "INPUT_TEXT",
                                    },
                                ],
                                event: "iggy-admin:server:reviveTarget",
                                name: "Revive Target",
                                collapse: true,
                                type: "server",
                            },
                        ],
                    },
                ],
            },
        },
    ]);

    function toggleDev() {
        dev = !dev;
        fetchNui("iggy-admin:toggleDev");
    }

    function toggleExpanded() {
        expanded = !expanded;
    }

    onMount(() => {
        const keyHandler = (e: KeyboardEvent) => {
            if (open && ["Escape"].includes(e.code)) {
                fetchNui("iggy-admin:closeMenu");
                open = false;
            }
        };

        window.addEventListener("keydown", keyHandler);

        return () => window.removeEventListener("keydown", keyHandler);
    });
</script>

<!-- {#if open} -->
<div
    class={`${expanded ? "w-full " : "w-1/4 "} h-full ${
        open ? "flex" : "hidden"
    } transition-all duration-200 relative `}
>
    <div class="bg-rose-600 h-full flex flex-col flex-auto">
        {#if tab === "COMMANDS"}
            <Commands {commands} />
        {:else if tab === "LOGS"}
            <Logs {expanded} />
        {:else if tab === "OPTIONS"}
            <Options />
        {/if}
        <div class="w-full h-16 flex">
            <NavButtons bind:selected={tab} />
        </div>
    </div>
    <div class="w-10 h-full bg-neutral-800 p-1 flex flex-col yy flex-none">
        <button
            class="w-full rounded-md border border-white text-white"
            on:click|preventDefault={toggleExpanded}
        >
            {#if expanded}
                <Icon icon="mingcute:left-fill" class="w-full h-full" />
            {:else}
                <Icon icon="mingcute:right-fill" class="w-full h-full" />
            {/if}
        </button>
        <button
            class={`w-full rounded-md border border-white text-white mt-auto transition-colors duration-150 ${
                dev ? "bg-rose-600" : ""
            }`}
            on:click|preventDefault={toggleDev}
        >
            <Icon icon="mdi:terminal-line" class="w-full h-full" />
        </button>
    </div>
</div>
<!-- {/if} -->
