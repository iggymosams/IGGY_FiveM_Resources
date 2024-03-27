import { CloseLaptop, OpenLaptop, RegisterLaptopCallback } from "./exports";

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
