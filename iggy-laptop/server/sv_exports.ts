import { Player } from "@zerio2/qbcore.js";
import { QBCore } from "./server";

function HasVPN(src: string | number): boolean {
    let player: Player = QBCore.Functions.GetPlayer(src);
    let vpn = player.Functions.GetItemByName("vpn");
    return vpn !== undefined;
}
global.exports("HasVPN", HasVPN);

export { HasVPN };
