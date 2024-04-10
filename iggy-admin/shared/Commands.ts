import {
    GetBoosts,
    GetGangs,
    GetItems,
    GetJobs,
    GetVehicles,
} from "../client/cl_utils";
import { CommandGroup, SelectionMenuCommandGroups } from "./types";

export let Commands: CommandGroup[] = [
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
                        choices: GetVehicles(),
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
                        choices: GetItems(),
                    },
                    { id: "amount", name: "Amount", type: "NUMBER" },
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
                        choices: GetVehicles(),
                    },
                    {
                        id: "plate",
                        name: "Plate",
                        type: "INPUT_TEXT",
                    },
                ],
            },
            // {
            //     id: "createBoost",
            //     name: "Create Boost",
            //     type: "SERVER",
            //     event: "iggy-admin:server:createBoost",
            //     commandType: "COLLAPSE",
            //     options: [
            //         {
            //             id: "player",
            //             name: "Player",
            //             type: "PLAYER_LIST",
            //         },
            //         {
            //             id: "boost",
            //             name: "Boost",
            //             type: "INPUT_SELECT",
            //             choices: await GetBoosts(),
            //         },
            //         {
            //             id: "rewardRep",
            //             name: "Rep Reward",
            //             type: "NUMBER",
            //         },
            //         {
            //             id: "cost",
            //             name: "Cost",
            //             type: "NUMBER",
            //         },
            //         {
            //             id: "rewardQBit",
            //             name: "QBit Reward",
            //             type: "NUMBER",
            //         },
            //         {
            //             id: "time",
            //             name: "Duration (in mins)",
            //             type: "NUMBER",
            //         },
            //     ],
            // },
            {
                id: "setJob",
                name: "Set Job",
                type: "SERVER",
                event: "iggy-admin:server:setJob",
                commandType: "COLLAPSE",
                options: [
                    {
                        id: "player",
                        name: "Player",
                        type: "PLAYER_LIST",
                    },
                    {
                        id: "job",
                        name: "Job",
                        type: "INPUT_SELECT",
                        choices: GetJobs(),
                    },
                    {
                        id: "rank",
                        name: "Rank",
                        type: "INPUT_ASYNC",
                        asyncCallback: "iggy-admin:getJobRanks",
                    },
                ],
            },
            {
                id: "setGang",
                name: "Set Gang",
                type: "SERVER",
                event: "iggy-admin:server:setGang",
                commandType: "COLLAPSE",
                options: [
                    {
                        id: "player",
                        name: "Player",
                        type: "PLAYER_LIST",
                    },
                    {
                        id: "gang",
                        name: "Gang",
                        type: "INPUT_SELECT",
                        choices: GetGangs(),
                    },
                    {
                        id: "rank",
                        name: "Rank",
                        type: "INPUT_ASYNC",
                        asyncCallback: "iggy-admin:getGangRanks",
                    },
                ],
            },
            {
                id: "giveMoney",
                name: "Give Money",
                type: "SERVER",
                event: "iggy-admin:server:giveMoney",
                commandType: "COLLAPSE",
                options: [
                    {
                        id: "player",
                        name: "Player",
                        type: "PLAYER_LIST",
                    },
                    {
                        id: "type",
                        name: "Type",
                        type: "INPUT_SELECT",
                        choices: [
                            { label: "Cash", value: "cash" },
                            { label: "Bank", value: "bank" },
                            { label: "Crypto", value: "crypto" },
                        ],
                    },
                    {
                        id: "amount",
                        name: "Amount",
                        type: "NUMBER",
                    },
                ],
            },
            {
                id: "openOutfits",
                name: "Open Outfits",
                type: "SERVER",
                event: "iggy-admin:server:openOutfits",
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
                            { label: "Extra Sunny", value: "EXTRASUNNY" },
                            { label: "Clear", value: "CLEAR" },
                            { label: "Neutral", value: "NEUTRAL" },
                            { label: "Smog", value: "SMOG" },
                            { label: "Foggy", value: "FOGGY" },
                            { label: "Overcast", value: "OVERCAST" },
                            { label: "Clouds", value: "CLOUDS" },
                            { label: "Clearing", value: "CLEARING" },
                            { label: "Rain", value: "RAIN" },
                            { label: "Thunder", value: "THUNDER" },
                            { label: "Snow", value: "SNOW" },
                            { label: "Blizzard", value: "BLIZZARD" },
                            { label: "Snow Light", value: "SNOWLIGHT" },
                            { label: "Xmas", value: "XMAS" },
                            { label: "Halloween", value: "HALLOWEEN" },
                        ],
                    },
                    { id: "time", name: "Time (HHMM)", type: "NUMBER" },
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
    {
        tab: "USER",
        commands: [
            {
                id: "kickTarget",
                name: "Kick Target",
                type: "SERVER",
                event: "iggy-admin:server:kick",
                commandType: "COLLAPSE",
                options: [
                    {
                        id: "player",
                        name: "Player",
                        type: "PLAYER_LIST",
                    },
                    {
                        id: "reason",
                        name: "Reason",
                        type: "INPUT_TEXT",
                    },
                ],
            },
            {
                id: "banTarget",
                name: "Ban Target",
                type: "SERVER",
                event: "iggy-admin:server:ban",
                commandType: "COLLAPSE",
                options: [
                    {
                        id: "player",
                        name: "Player",
                        type: "PLAYER_LIST",
                    },
                    {
                        id: "reason",
                        name: "Reason",
                        type: "INPUT_TEXT",
                    },
                    {
                        id: "duration",
                        name: "Duration",
                        type: "INPUT_SELECT",
                        choices: [
                            { label: "1 Hour", value: 60 },
                            { label: "6 Hour", value: 360 },
                            { label: "12 Hour", value: 720 },
                            { label: "1 Day", value: 1440 },
                            { label: "3 Day", value: 4320 },
                            { label: "1 Week", value: 10080 },
                            { label: "30 Days", value: 43200 },
                            { label: "Permanent", value: 2147483647 },
                        ],
                    },
                ],
            },
            {
                id: "spectateTarget",
                name: "Spectate Target",
                type: "SERVER",
                event: "iggy-admin:server:spectate",
                commandType: "COLLAPSE",
                options: [
                    {
                        id: "player",
                        name: "Player",
                        type: "PLAYER_LIST",
                    },
                ],
            },
        ],
    },
];

export let SelectionMenuCommands: SelectionMenuCommandGroups = {
    PLAYER: [
        {
            id: "killPlayer",
            name: "Kill Player",
            event: "iggy-admin:client:SM:killPlayer",
        },
        {
            id: "revivePlayer",
            name: "Revive Player",
            event: "iggy-admin:client:SM:revivePlayer",
        },
        {
            id: "freezePlayer",
            name: "Freeze Player",
            event: "iggy-admin:client:SM:freezePlayer",
        },
        {
            id: "spectatePlayer",
            name: "Spectate Player",
            event: "iggy-admin:client:SM:spectatePlayer",
        },
    ],
    OBJECT: [
        {
            id: "deleteObj",
            name: "Delete Object",
            event: "iggy-admin:client:SM:deleteEntity",
        },
    ],
    PED: [
        {
            id: "deletePed",
            name: "Delete Ped",
            event: "iggy-admin:client:SM:deleteEntity",
        },
        {
            id: "killPed",
            name: "Kill Ped",
            event: "iggy-admin:client:SM:killPed",
        },
    ],
    VEHICLE: [
        {
            id: "deleteVehicle",
            name: "Delete Vehicle",
            event: "iggy-admin:client:SM:deleteEntity",
        },
        {
            id: "repairVehicle",
            name: "Repair Vehicle",
            event: "iggy-admin:client:SM:repairVehicle",
        },
        {
            id: "cleanVehicle",
            name: "Clean Vehicle",
            event: "iggy-admin:client:SM:cleanVehicle",
        },
        {
            id: "maxmodsVehicle",
            name: "Max Mods Vehicle",
            event: "iggy-admin:client:SM:maxmodsVehicle",
        },
        {
            id: "refuelVehicle",
            name: "Refuel Vehicle",
            event: "iggy-admin:client:SM:refuelVehicle",
        },
        {
            id: "warpintoVehicle",
            name: "Warp Into Vehicle",
            event: "iggy-admin:client:SM:warpintoVehicle",
        },
        {
            id: "getKeys",
            name: "Get Keys",
            event: "iggy-admin:client:SM:getKeys",
        },
    ],
    DOOR: [
        {
            id: "deleteDoor",
            name: "Delete Door",
            event: "iggy-admin:client:SM:deleteEntity",
        },
        {
            id: "lockDoor",
            name: "Lock Door",
            event: "iggy-admin:client:SM:lockDoor",
        },
        {
            id: "unlockDoor",
            name: "Unlock Door",
            event: "iggy-admin:client:SM:unlockDoor",
        },
    ],
};
