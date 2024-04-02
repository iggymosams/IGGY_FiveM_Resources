import { oxmysql as MySQL } from "@overextended/oxmysql";
import { Server, Item, Player } from "@zerio2/qbcore.js";

const QBCore: Server = global.exports["qb-core"].GetCoreObject();

QBCore.Functions.CreateUseableItem("vpn", (src, item: Item) => {
    emitNet("iggy-laptop:client:openHandle", src, item);
});

QBCore.Functions.CreateCallback(
    "iggy-laptop:cb:updateHandle",
    async (src, cb: (data: boolean) => void, args: any[]) => {
        let newHandle: string = args[0];
        let replace: boolean = args[1];
        let vpn: Item = args[2];
        const updated = await SetHandle(
            newHandle,
            replace ? vpn.info.handle : undefined
        );
        if (updated) {
            let info: Record<string, unknown> = {};
            info.handle = newHandle;
            QBCore.Functions.GetPlayer(src).Functions.RemoveItem(
                "vpn",
                1,
                vpn.slot
            );
            QBCore.Functions.GetPlayer(src).Functions.AddItem(
                "vpn",
                1,
                vpn.slot,
                info
            );
        }
        cb(updated);
    }
);

QBCore.Functions.CreateCallback(
    "iggy-laptop:cb:getHandle",
    async (src, cb: (data: string) => void) => {
        cb(await GetHandle(src));
    }
);

function GetHandle(src: string | number): string | undefined {
    let player: Player = QBCore.Functions.GetPlayer(src);
    let vpn = player.Functions.GetItemByName("vpn");
    let handle = undefined;
    if (vpn !== undefined) {
        handle = vpn.info.handle;
    }
    return handle;
}
global.exports("GetHandle", GetHandle);

async function SetHandle(handle: string, replace?: string): Promise<boolean> {
    let response = await MySQL.query(
        "SELECT handle FROM `iggy_laptop_handle` WHERE `handle` = ?",
        [handle]
    );

    if (response[0] !== undefined) {
        return false;
    }

    if (replace) {
        await MySQL.query(
            "DELETE FROM `iggy_laptop_handle` WHERE `handle` = ?",
            [replace]
        );
    }

    await MySQL.insert("INSERT INTO `iggy_laptop_handle` (handle) VALUES (?)", [
        handle,
    ]);
    return true;
}
global.exports("SetHandle", SetHandle);

export { GetHandle, SetHandle };
