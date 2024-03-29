import { CloseLaptop, OpenLaptop, RegisterLaptopCallback } from "./cl_exports";
import "./cl_handle";

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

onNet("iggy-laptop:client:open", () => {
    OpenLaptop(true, true, false);
});
