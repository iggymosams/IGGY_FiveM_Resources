<script lang="ts">
    import { debugData } from "../../utils/debugData";
    import Commands from "./Commands/Commands.svelte";
    import { useNuiEvent } from "../../utils/useNuiEvent";
    import type { CommandGroup, OpenData } from "../../types/types";
    import Logs from "./Logs/Logs.svelte";
    import Options from "./Options.svelte";
    import { onMount } from "svelte";
    import { fetchNui } from "../../utils/fetchNui";
    import Players from "./Players/Players.svelte";
    import SideBar from "./SideBar.svelte";

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
                                name: "NoClip",
                                type: "CLIENT",
                                event: "iggy-admin:client:toggleNoClip",
                                commandType: "TOGGLE",
                            },
                            {
                                id: "reviveSelf",
                                name: "Revive Self",
                                type: "SERVER",
                                event: "iggy-admin:server:reviveSelf",
                                commandType: "BUTTON",
                            },
                            {
                                id: "reviveInDistance",
                                name: "Revive In Distance",
                                type: "SERVER",
                                event: "iggy-admin:server:reviveInDistance",
                                commandType: "BUTTON",
                            },
                            {
                                id: "reviveTarget",
                                name: "Revive Target",
                                type: "SERVER",
                                event: "iggy-admin:server:reviveTarget",
                                commandType: "COLLAPSE",
                                options: [
                                    {
                                        id: "player",
                                        name: "Player",
                                        type: "PLAYER_LIST",
                                    },
                                ],
                            },
                            {
                                id: "cloak",
                                name: "Cloak",
                                type: "SERVER",
                                event: "iggy-admin:server:toggleCloak",
                                commandType: "TOGGLE",
                            },
                            {
                                id: "godmode",
                                name: "Godmode",
                                type: "SERVER",
                                event: "iggy-admin:server:toggleGodMode",
                                commandType: "TOGGLE",
                            },
                            {
                                id: "killTarget",
                                name: "Kill Target",
                                type: "SERVER",
                                event: "iggy-admin:server:killTarget",
                                commandType: "COLLAPSE",
                                options: [
                                    {
                                        id: "player",
                                        name: "Player",
                                        type: "PLAYER_LIST",
                                    },
                                ],
                            },
                            {
                                id: "FreezeTarget",
                                name: "Freeze Target",
                                type: "SERVER",
                                event: "iggy-admin:server:freezeTarget",
                                commandType: "COLLAPSE",
                                options: [
                                    {
                                        id: "player",
                                        name: "Player",
                                        type: "PLAYER_LIST",
                                    },
                                ],
                            },
                            {
                                id: "seatInTargetVehicle",
                                name: "Seat In Target Vehicle",
                                type: "SERVER",
                                event: "iggy-admin:server:seatInTargetVehicle",
                                commandType: "COLLAPSE",
                                options: [
                                    {
                                        id: "player",
                                        name: "Player",
                                        type: "PLAYER_LIST",
                                    },
                                ],
                            },
                            {
                                id: "openInventory",
                                name: "Open Inventory",
                                type: "SERVER",
                                event: "iggy-admin:server:openInventory",
                                commandType: "COLLAPSE",
                                closeMenu: true,
                                options: [
                                    {
                                        id: "player",
                                        name: "Player",
                                        type: "PLAYER_LIST",
                                    },
                                ],
                            },
                            {
                                id: "openClothing",
                                name: "Open Clothing",
                                type: "SERVER",
                                event: "iggy-admin:server:openClothing",
                                commandType: "COLLAPSE",
                                closeMenu: true,
                                options: [
                                    {
                                        id: "player",
                                        name: "Player",
                                        type: "PLAYER_LIST",
                                    },
                                ],
                            },
                            {
                                id: "openBennys",
                                type: "SERVER",
                                event: "iggy-admin:server:openBennys",
                                commandType: "COLLAPSE",
                                closeMenu: true,
                                options: [
                                    {
                                        id: "player",
                                        name: "Player",
                                        type: "PLAYER_LIST",
                                    },
                                ],
                                name: "Open Bennys",
                            },
                            {
                                id: "spawnVehicle",
                                name: "Spawn Vehicle",
                                type: "SERVER",
                                event: "iggy-admin:server:spawnVehicle",
                                commandType: "COLLAPSE",
                                options: [
                                    {
                                        id: "model",
                                        name: "Model",
                                        type: "INPUT_SELECT",
                                        choices: [],
                                    },
                                    {
                                        id: "override",
                                        name: "Model Override",
                                        type: "INPUT_TEXT",
                                    },
                                    {
                                        id: "seat",
                                        name: "Seat in Vehicle",
                                        type: "BUTTON",
                                        eventType: "CLIENT",
                                        event: "iggy-admin:client:seatInSpawnedVeh",
                                    },
                                ],
                            },
                            {
                                id: "spawnItem",
                                name: "Spawn Item",
                                type: "SERVER",
                                event: "iggy-admin:server:spawnItem",
                                commandType: "COLLAPSE",
                                options: [
                                    {
                                        id: "item",
                                        name: "Item",
                                        type: "INPUT_SELECT",
                                        choices: [],
                                    },
                                    {
                                        id: "amount",
                                        name: "Amount",
                                        type: "NUMBER",
                                    },
                                ],
                            },
                            {
                                id: "fixVehicle",
                                name: "Fix Vehicle",
                                type: "CLIENT",
                                event: "iggy-admin:client:fixVehicle",
                                commandType: "BUTTON",
                            },
                            {
                                id: "giveVehicle",
                                name: "Give Vehicle",
                                type: "SERVER",
                                event: "iggy-admin:server:giveVehicle",
                                commandType: "COLLAPSE",
                                options: [
                                    {
                                        id: "player",
                                        name: "Player",
                                        type: "PLAYER_LIST",
                                    },
                                    {
                                        id: "model",
                                        name: "Model",
                                        type: "INPUT_SELECT",
                                        choices: [],
                                    },
                                    {
                                        id: "plate",
                                        name: "Plate",
                                        type: "INPUT_TEXT",
                                    },
                                ],
                            },
                            {
                                id: "createBoost",
                                name: "Create Boost",
                                type: "SERVER",
                                event: "iggy-admin:server:createBoost",
                                commandType: "COLLAPSE",
                                options: [
                                    {
                                        id: "player",
                                        name: "Player",
                                        type: "PLAYER_LIST",
                                    },
                                    {
                                        id: "boost",
                                        name: "Boost",
                                        type: "INPUT_SELECT",
                                        choices: [],
                                    },
                                    {
                                        id: "rewardRep",
                                        name: "Rep Reward",
                                        type: "NUMBER",
                                    },
                                    {
                                        id: "cost",
                                        name: "Cost",
                                        type: "NUMBER",
                                    },
                                    {
                                        id: "rewardQBit",
                                        name: "QBit Reward",
                                        type: "NUMBER",
                                    },
                                    {
                                        id: "time",
                                        name: "Duration (in mins)",
                                        type: "NUMBER",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        tab: "UTILITY",
                        commands: [
                            {
                                id: "names",
                                name: "Toggle Names",
                                type: "CLIENT",
                                event: "iggy-admin:client:toggleNames",
                                commandType: "TOGGLE",
                            },
                            // {
                            //     id: "blips",
                            //     name: "Toggle Blips",
                            //     type: "CLIENT",
                            //     event: "iggy-admin:client:toggleBlips",
                            //     commandType: "TOGGLE",
                            // },
                            {
                                id: "gotoTarget",
                                name: "Goto Target",
                                type: "SERVER",
                                event: "iggy-admin:server:goToTarget",
                                commandType: "COLLAPSE",
                                options: [
                                    {
                                        id: "player",
                                        name: "Player",
                                        type: "PLAYER_LIST",
                                    },
                                ],
                            },
                            {
                                id: "bringTarget",
                                name: "Bring Target",
                                type: "SERVER",
                                event: "iggy-admin:server:bringTarget",
                                commandType: "COLLAPSE",
                                options: [
                                    {
                                        id: "player",
                                        name: "Player",
                                        type: "PLAYER_LIST",
                                    },
                                ],
                            },
                            {
                                id: "weatherAndTime",
                                name: "Weather and Time",
                                type: "SERVER",
                                event: "iggy-admin:server:weather",
                                commandType: "COLLAPSE",
                                options: [
                                    {
                                        id: "weather",
                                        name: "Weather",
                                        type: "INPUT_SELECT",
                                        choices: [
                                            {
                                                label: "Extra Sunny",
                                                value: "EXTRASUNNY",
                                            },
                                            { label: "Clear", value: "CLEAR" },
                                            {
                                                label: "Neutral",
                                                value: "NEUTRAL",
                                            },
                                            { label: "Smog", value: "SMOG" },
                                            { label: "Foggy", value: "FOGGY" },
                                            {
                                                label: "Overcast",
                                                value: "OVERCAST",
                                            },
                                            {
                                                label: "Clouds",
                                                value: "CLOUDS",
                                            },
                                            {
                                                label: "Clearing",
                                                value: "CLEARING",
                                            },
                                            { label: "Rain", value: "RAIN" },
                                            {
                                                label: "Thunder",
                                                value: "THUNDER",
                                            },
                                            { label: "Snow", value: "SNOW" },
                                            {
                                                label: "Blizzard",
                                                value: "BLIZZARD",
                                            },
                                            {
                                                label: "Snow Light",
                                                value: "SNOWLIGHT",
                                            },
                                            { label: "Xmas", value: "XMAS" },
                                            {
                                                label: "Halloween",
                                                value: "HALLOWEEN",
                                            },
                                        ],
                                    },
                                    {
                                        id: "time",
                                        name: "Time (HHMM)",
                                        type: "NUMBER",
                                    },
                                ],
                            },
                            {
                                id: "displayCoords",
                                name: "Display Coords",
                                type: "CLIENT",
                                event: "iggy-admin:client:displayCoords",
                                commandType: "TOGGLE",
                            },
                            {
                                id: "copyVec3",
                                name: "Copy Vector 3",
                                type: "CLIENT",
                                event: "iggy-admin:client:copyVec3",
                                commandType: "BUTTON",
                            },
                            {
                                id: "copyVec4",
                                name: "Copy Vector 4",
                                type: "CLIENT",
                                event: "iggy-admin:client:copyVec4",
                                commandType: "BUTTON",
                            },
                            {
                                id: "createObject",
                                name: "Create Object",
                                type: "SERVER",
                                event: "iggy-admin:server:createObject",
                                commandType: "COLLAPSE",
                                closeMenu: true,
                                options: [
                                    {
                                        id: "object",
                                        name: "Object",
                                        type: "INPUT_TEXT",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        },
    ]);

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

<div
    class={`${expanded ? "w-2/3 left-1/2" : "w-1/5 left-[87%]"} h-[90%] ${
        open ? "flex" : "hidden"
    } bg-neutral-900 absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300`}
>
    <SideBar bind:tab bind:expanded bind:dev />
    <div class="w-full h-full overflow-hidden">
        {#if tab === "COMMANDS"}
            <Commands {commands} />
        {:else if tab === "PLAYERS"}
            <Players />
        {:else if tab === "LOGS"}
            <Logs {expanded} />
        {:else if tab === "OPTIONS"}
            <Options />
        {/if}
    </div>
</div>
