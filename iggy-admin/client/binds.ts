import { DevMode } from "./client";
import { Bind } from "../shared/types";
import {
    RegisterNuiCallback,
    RegisterQBCallBack,
    getCommandFromId,
} from "./cl_utils";

let binds: Bind[];

RegisterBind("keybind1", "Bind 1", "Keybind 1");
RegisterBind("keybind2", "Bind 2", "Keybind 2");
RegisterBind("keybind3", "Bind 3", "Keybind 3");
RegisterBind("keybind4", "Bind 4", "Keybind 4");
RegisterBind("keybind5", "Bind 5", "Keybind 5");

function RegisterBind(id: string, bind: string, name: string) {
    RegisterCommand(
        `+iggy-admin:${id}`,
        () => {
            executeBind(bind);
        },
        false
    );
    RegisterKeyMapping(
        `+iggy-admin:${id}`,
        `zzAdmin ${name}`,
        "keyboard",
        "F2"
    );
}

function executeBind(bind: string) {
    if (DevMode) {
        binds.forEach((b) => {
            if (b.name === bind) {
                if (b.cmd === undefined) return;
                let cmd = getCommandFromId(b.cmd.id);
                if (cmd.commandType === "TOGGLE") {
                    if (cmd.active) {
                        cmd.active = false;
                    } else {
                        cmd.active = true;
                    }
                }
                if (cmd.type === "CLIENT") {
                    emit(cmd.event);
                } else {
                    emitNet(cmd.event);
                }
            }
        });
    }
}

RegisterNuiCallback("iggy-admin:getBinds", async () => {
    if (!binds) {
        binds = await RegisterQBCallBack("iggy-admin:cb:getBinds");
    }
    return binds;
});

RegisterNuiCallback("iggy-admin:updateBinds", (newBinds: Bind[]) => {
    binds = newBinds;
    emitNet("iggy-admin:server:updateBinds", newBinds);
});

binds = await RegisterQBCallBack("iggy-admin:cb:getBinds");
