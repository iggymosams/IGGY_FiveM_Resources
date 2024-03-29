import { Client } from "@zerio2/qbcore.js";
import { CloseLaptop, OpenLaptop, RegisterLaptopCallback } from "./cl_exports";
import "./cl_handle";

const QBCore: Client = global.exports["qb-core"].GetCoreObject();

RegisterCommand(
    "iggy-laptop:open",
    () => {
        OpenLaptop(true, true);
    },
    false
);

RegisterLaptopCallback("closeLaptop", () => {
    CloseLaptop();
});

onNet("iggy-laptop:client:open", (hasVPN: boolean, handle: string) => {
    OpenLaptop(true, true, hasVPN, handle);
});
