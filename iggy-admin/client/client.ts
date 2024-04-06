import { Commands, SelectionMenuCommands } from "./../shared/Commands";
import {
    Command,
    CommandData,
    CommandGroup,
    Log,
    OptionChoice,
    RunCommandData,
    SelectionMenuType,
} from "./../shared/types";
import {
    RaycastCamera,
    RegisterNuiCallback,
    RegisterQBCallBack,
    SendMenuMessage,
    getCommandFromId,
    isDoor,
} from "./cl_utils";
import "./events";
import "./binds";
import "./handlers";
import "./obj_creator";
import { Client } from "qbcore.js";
import { entitys } from "../shared/entitys";
export let open = false;
export let DevMode: boolean = true;
export let holdingSM: boolean = false;
export let SelectedEntity: number = 0;

const QBCore: Client = global.exports["qb-core"].GetCoreObject();

let favourites: string[];

RegisterCommand(
    "menu",
    () => {
        OpenMenu();
    },
    false
);
RegisterCommand(
    "+adminMenu",
    () => {
        if (DevMode) OpenMenu();
    },
    false
);
RegisterKeyMapping("+adminMenu", "zzOpen Admin Menu", "keyboard", "F5");

async function OpenMenu() {
    let commands: CommandGroup[] = await LoadCommands();

    SendMenuMessage("toggleAdminMenu", {
        open: true,
        commands: commands,
        dev: DevMode,
    });
    open = true;
    SetNuiFocus(true, true);
}

async function LoadCommands(): Promise<CommandGroup[]> {
    let cmds = Commands;
    if (!favourites) {
        favourites = await RegisterQBCallBack("iggy-admin:cb:getFavourites");
    }
    cmds.forEach((group) => {
        group.commands.forEach((cmd) => {
            cmd.active = cmd.active || false;
            cmd.favourite = favourites.includes(cmd.id) || false;
        });
    });
    return cmds;
}

RegisterNuiCallback("iggy-admin:closeMenu", () => {
    SetNuiFocus(false, false);
    open = false;
});

RegisterNuiCallback("iggy-admin:getPlayers", async () => {
    let data = await RegisterQBCallBack("iggy-admin:cb:getPlayers");
    return data;
});

RegisterNuiCallback("iggy-admin:toggleFavourite", async (id: string) => {
    if (favourites.includes(id)) {
        favourites = favourites.filter((cmd) => cmd !== id);
    } else {
        favourites.push(id);
    }

    emitNet("iggy-admin:server:updateFavourites", favourites);
});

RegisterNuiCallback("iggy-admin:runCommand", (command: RunCommandData) => {
    RunCommand(command);
});

RegisterNuiCallback("iggy-admin:toggleDev", (command: RunCommandData) => {
    DevMode = !DevMode;
});

RegisterNuiCallback("iggy-admin:runSMCommand", (command: RunCommandData) => {
    emit(command.event);
});

RegisterNuiCallback("iggy-admin:closeSMMenu", () => {
    SetNuiFocus(false, false);
    if (SelectedEntity !== undefined)
        SetEntityDrawOutline(SelectedEntity, false);
});

RegisterNuiCallback("iggy-admin:getOptions", () => {
    let options: Command[] = [];
    Commands.forEach((group) => {
        group.commands.forEach((cmd) => {
            if (cmd.commandType === "BUTTON" || cmd.commandType === "TOGGLE") {
                options.push(cmd);
            }
        });
    });
    return options;
});

RegisterNuiCallback("iggy-admin:getLogs", async () => {
    let logs: Log[] = await RegisterQBCallBack("iggy-admin:cb:getLogs");
    return logs;
});

RegisterNuiCallback("iggy-admin:toggleFocus", async () => {
    SetNuiFocus(false, false);
    await global.exports["iggy-utils"].Delay(10);
    while (true) {
        if (IsControlJustPressed(0, 25)) {
            SetNuiFocus(true, true);
            break;
        }
        if (!open) break;
        await global.exports["iggy-utils"].Delay(0);
    }
});

RegisterNuiCallback("iggy-admin:getPlayersData", async () => {
    let data = await RegisterQBCallBack("iggy-admin:cb:getPlayersData");
    return data;
});

RegisterNuiCallback("iggy-admin:getPlayersData", async () => {
    let data = await RegisterQBCallBack("iggy-admin:cb:getPlayersData");
    return data;
});

RegisterNuiCallback(
    "iggy-admin:spawnPlayerVehicle",
    (command: { data: CommandData }) => {
        emitNet("iggy-admin:server:spawnPlayerVehicle", command.data);
    }
);

RegisterNuiCallback("iggy-admin:getJobRanks", (data: CommandData) => {
    if (data.values["job"]) {
        let job = QBCore.Shared.Jobs[data.values["job"].value];
        let jobs: OptionChoice[] = [];
        Object.keys(job.grades).forEach((v) => {
            let grade = job.grades[v];
            let data = {
                value: v,
                label: grade.name,
            };
            jobs.push(data);
        });
        return jobs;
    }
});

RegisterNuiCallback("iggy-admin:getGangRanks", (data: CommandData) => {
    if (data.values["gang"]) {
        let gang = QBCore.Shared.Gangs[data.values["gang"].value];
        let gangs: OptionChoice[] = [];
        Object.keys(gang.grades).forEach((v) => {
            let grade = gang.grades[v];
            let data = {
                value: v,
                label: grade.name,
            };
            gangs.push(data);
        });
        return gangs;
    }
});

async function RunCommand(command: RunCommandData) {
    let cmd: Command = getCommandFromId(command.id);

    if (cmd.commandType === "TOGGLE") {
        if (cmd.active) {
            cmd.active = false;
        } else {
            cmd.active = true;
        }
    }

    if (cmd.closeMenu) {
        SendMenuMessage("toggleAdminMenu", {
            open: false,
        });
        SetNuiFocus(false, false);
        open = false;
    }

    if (command.type === "CLIENT") {
        emit(command.event, command.data);
    } else {
        emitNet(command.event, command.data);
    }
}

RegisterCommand(
    "+selectionMenu",
    () => {
        if (DevMode) {
            ToggleSelectionMenu();
        }
    },
    false
);

RegisterCommand(
    "-selectionMenu",
    () => {
        holdingSM = false;
    },
    false
);
RegisterKeyMapping(
    "+selectionMenu",
    "zzAdmin Toggle Selection Menu",
    "keyboard",
    "f3"
);

async function ToggleSelectionMenu() {
    holdingSM = true;
    let checkpoint;
    let found = false;
    let entityFound;

    let menuType: SelectionMenuType;
    SetEntityDrawOutline(SelectedEntity, false);

    while (holdingSM) {
        let { hit, coords, entity } = RaycastCamera(1000);
        3;
        DisplaySniperScopeThisFrame();
        if (hit) {
            if (IsEntityAVehicle(entity)) {
                SetEntityDrawOutline(entityFound, false);
                menuType = "VEHICLE";
                found = true;
                entityFound = entity;
                SetEntityDrawOutline(entity, true);
            } else if (IsEntityAPed(entity) && !IsPedAPlayer(entity)) {
                SetEntityDrawOutline(entityFound, false);
                menuType = "PED";
                found = true;
                entityFound = entity;
                let position = GetEntityCoords(entity, true);
                DeleteCheckpoint(checkpoint);
                checkpoint = CreateCheckpoint(
                    47,
                    position[0],
                    position[1],
                    position[2] - 1,
                    0,
                    0,
                    0,
                    1.0,
                    100,
                    255,
                    0,
                    255,
                    0
                );
                SetCheckpointCylinderHeight(checkpoint, 0.5, 0.5, 1.0);
            } else if (IsEntityAnObject(entity)) {
                SetEntityDrawOutline(entityFound, false);
                let [is, door] = isDoor(SelectedEntity);
                if (is) {
                    menuType = "DOOR";
                    found = true;
                    entityFound = entity;
                } else {
                    menuType = "OBJECT";
                    found = true;
                    entityFound = entity;
                }
                SetEntityDrawOutline(entity, true);
            } else if (IsPedAPlayer(entity)) {
                SetEntityDrawOutline(entityFound, false);
                menuType = "PLAYER";
                found = true;
                entityFound = GetPlayerServerId(
                    NetworkGetPlayerIndexFromPed(entity)
                );
                let position = GetEntityCoords(entity, true);
                DeleteCheckpoint(checkpoint);
                checkpoint = CreateCheckpoint(
                    47,
                    position[0],
                    position[1],
                    position[2] - 1,
                    0,
                    0,
                    0,
                    1.0,
                    100,
                    255,
                    0,
                    255,
                    0
                );
                SetCheckpointCylinderHeight(checkpoint, 0.5, 0.5, 1.0);
            } else {
                DrawMarker(
                    28,
                    // COORDS
                    coords[0],
                    coords[1],
                    coords[2],
                    // DIR
                    0.0,
                    0.0,
                    0.0,
                    // ROT
                    0.0,
                    180.0,
                    0.0,
                    // SCALE
                    0.2,
                    0.2,
                    0.2,
                    // COLOR
                    0,
                    255,
                    0,
                    // ALPHA
                    255,
                    false,
                    true,
                    2,
                    null,
                    null,
                    null,
                    false
                );
            }
        }

        await global.exports["iggy-utils"].Delay(0);
        DeleteCheckpoint(checkpoint);
    }

    if (found) {
        SelectedEntity = entityFound;
        OpenSelectionMenu(menuType);
    }
}

function OpenSelectionMenu(type: SelectionMenuType) {
    let cmds = SelectionMenuCommands[type];
    let name = entitys[GetEntityModel(SelectedEntity)];
    let data = `Model: ${name} (${GetEntityModel(SelectedEntity)})`;
    SendMenuMessage("openSelectionMenu", {
        open: true,
        commands: cmds,
        type: type,
        data: data,
    });
    SetNuiFocus(true, true);
}

function getDevmode() {
    return DevMode;
}
global.exports("getDevmode", getDevmode);

export function setOpen(newOpen: boolean) {
    open = newOpen;
}

export { getDevmode };
