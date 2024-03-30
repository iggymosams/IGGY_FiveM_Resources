import { Item } from "@zerio2/qbcore.js";
import { SendAppMessage, SetFocus, RegisterLaptopCallback } from "./cl_exports";
import { TriggerQBCallBack } from "./cl_utils";

let vpn: Item;

onNet("iggy-laptop:client:openHandle", (item: Item) => {
    SendAppMessage("handle", "toggleEdit", {
        visible: true,
        editValue: item.info.handle,
    });
    SetFocus(true, true);
    vpn = item;
});

RegisterLaptopCallback("closeHandleEdit", () => {
    SetFocus(false, false);
});

RegisterLaptopCallback(
    "updateHandle",
    async ({ value, editing }: { value: string; editing: boolean }) => {
        let ok = await TriggerQBCallBack(
            "iggy-laptop:cb:updateHandle",
            value,
            editing,
            vpn
        );
        if (ok) {
            SendAppMessage("handle", "toggleEdit", false);
            SetFocus(false, false);
            vpn = undefined;

            return { ok: true };
        } else {
            return { ok: false };
        }
    }
);
