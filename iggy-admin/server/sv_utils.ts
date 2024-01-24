import { Server } from "qbcore.js";
import { CommandData } from "../shared/types";

const QBCore: Server = global.exports["qb-core"].GetCoreObject();

function isAdmin(src: number): boolean {
    let isGod = QBCore.Functions.HasPermission(src, "god");
    if (isGod) return true;
    let admin = QBCore.Functions.HasPermission(src, "admin");
    if (admin) return true;
    return false;
}

function RegisterAdminCommand(
    eventName: string,
    callback: (src: number, data: CommandData) => void
) {
    onNet(eventName, (data: CommandData) => {
        let src = source;
        if (isAdmin(src)) {
            callback(src, data);
        }
    });
}

function GeneratePlate(): string {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let plate = "";
    for (let i = 0; i < 8; i++) {
        let char = characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
        plate += char;
    }
    return plate;
}

export { isAdmin, RegisterAdminCommand, GeneratePlate };
