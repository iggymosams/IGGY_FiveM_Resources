import { Player, Server } from "@zerio2/qbcore.js";
import "./sv_handle";

const QBCore: Server = global.exports["qb-core"].GetCoreObject();

QBCore.Functions.CreateUseableItem("laptop", (src, item) => {
    let player: Player = QBCore.Functions.GetPlayer(src);
    let vpn = player.Functions.GetItemByName("vpn");
    let hasVPN = vpn !== undefined;
    let handle = undefined;
    if (hasVPN) handle = vpn.info.handle;
    emitNet("iggy-laptop:client:open", src, hasVPN, handle);
});
