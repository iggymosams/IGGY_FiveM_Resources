import "./exports";
import {
    RegisterLaptopCallback,
    OpenLaptop,
    CloseLaptop,
    SendAppMessage,
    SetFocus,
} from "./exports";
RegisterCommand(
    "iggy-laptop:open",
    () => {
        OpenLaptop(true, true);
    },
    false
);

RegisterCommand(
    "iggy-laptop:restart",
    () => {
        SetFocus(false, false);
        SendAppMessage("base", "restart");
    },
    false
);

RegisterLaptopCallback("hideLaptop", () => {
    CloseLaptop();
});

onNet("iggy-laptop:client:open", () => {
    OpenLaptop(true, true);
});
