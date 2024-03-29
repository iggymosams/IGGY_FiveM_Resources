import { Server } from "@zerio2/qbcore.js";
import "./sv_handle";

const QBCore: Server = global.exports["qb-core"].GetCoreObject();

QBCore.Functions.CreateUseableItem("laptop", (src, item) => {
    emitNet("iggy-laptop:client:open", src);
});
