import { Server } from "qbcore.js";

const QBCore: Server = global.exports["qb-core"].GetCoreObject();

let cloakEnabled: { [key: number]: boolean } = {};
let godmodeEnabled: { [key: number]: boolean } = {};
let namesEnabled: { [key: number]: boolean } = {};

function ToggleCloak(src: number) {
    cloakEnabled[src] = !cloakEnabled[src];
    let type = cloakEnabled[src] ? "success" : "error";
    let msg = cloakEnabled[src] ? "Cloak Enabled" : "Cloak Disabled";
    emitNet("QBCore:Notify", src, msg, type, 5000);
    emitNet("iggy-admin:client:toggleCloak", -1, src, cloakEnabled[src]);
}

function ToggleGodmode(src: number) {
    godmodeEnabled[src] = !godmodeEnabled[src];
    let type = godmodeEnabled[src] ? "success" : "error";
    let msg = godmodeEnabled[src] ? "Godmode Enabled" : "Godmode Disabled";
    emitNet("QBCore:Notify", src, msg, type, 5000);
    emitNet("iggy-admin:client:toggleGodmode", src, godmodeEnabled[src]);
}

function ToggleNames(src: number) {
    namesEnabled[src] = !namesEnabled[src];
    let type = namesEnabled[src] ? "success" : "error";
    let msg = namesEnabled[src] ? "Names Enabled" : "Names Disabled";
    emitNet("QBCore:Notify", src, msg, type, 5000);
}

QBCore.Functions.CreateCallback(
    "iggy-admin:cb:getCloaked",
    async (source: number, cb: (data: { [key: number]: boolean }) => void) => {
        cb(cloakEnabled);
    }
);
export { ToggleCloak, ToggleGodmode, ToggleNames };
