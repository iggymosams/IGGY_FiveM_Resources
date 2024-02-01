import { Client } from "@zerio2/qbcore.js";
import { CalcDist } from "../shared/utils";
import "./exports";
import {
    RegisterLaptopCallback,
    OpenLaptop,
    CloseLaptop,
    SendAppMessage,
    SetFocus,
} from "./exports";

const QBCore: Client = global.exports["qb-core"].GetCoreObject();

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
    OpenLaptop(true, true, QBCore.Functions.HasItem("vpn"));
});

onNet(
    "iggy-laptop:client:PlayInDistance",
    (coords: number[], maxDist: number, sound: string, volume: number) => {
        let myCoords = GetEntityCoords(PlayerPedId(), true);
        let dist = CalcDist(
            coords[0],
            coords[1],
            coords[2],
            myCoords[0],
            myCoords[1],
            myCoords[2]
        );
        if (dist < maxDist) {
            let vol = volume / dist;
            if (dist === 0) vol = volume;
            SendAppMessage("base", "playSound", {
                sound: sound,
                volume: vol,
            });
        }
    }
);
