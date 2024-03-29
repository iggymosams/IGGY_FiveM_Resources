import { Player, Server } from "@zerio2/qbcore.js";
import "./sv_handle";
import "./sv_exports";
import { GetHandle } from "./sv_handle";
import { HasVPN } from "./sv_exports";

export const QBCore: Server = global.exports["qb-core"].GetCoreObject();

QBCore.Functions.CreateUseableItem("laptop", async (src, item) => {
    emitNet("iggy-laptop:client:open", src, HasVPN(src), await GetHandle(src));
});
