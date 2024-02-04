import {
    AdminPlayerData,
    Bind,
    CharInfo,
    Log,
    OptionChoice,
    Player,
    Vehicle,
} from "./../shared/types";
import { Server, Player as QBPlayer } from "qbcore.js";
import { oxmysql as MySQL } from "@overextended/oxmysql";
import "./events";
import { isAdmin } from "./sv_utils";
const QBCore: Server = global.exports["qb-core"].GetCoreObject();

async function getPlayers(): Promise<Player[]> {
    const Players = QBCore.Functions.GetPlayers();
    let players: Player[] = [];
    Players.forEach((serverID: number) => {
        let name = GetPlayerName(serverID.toString());
        let id = QBCore.Functions.GetIdentifier(serverID, "steam");
        let player = {
            serverId: serverID.toString(),
            name: name,
            id: id,
            display: `[${serverID}] ${name} [${id}]`,
        };
        players.push(player);
    });
    return players;
}

QBCore.Functions.CreateCallback(
    "iggy-admin:cb:getPlayers",
    async (source: number, cb: (data: Player[]) => void) => {
        cb(await getPlayers());
    }
);

async function loadFavourites(src: number): Promise<string[]> {
    let license = QBCore.Functions.GetIdentifier(src, "license");
    const result = await MySQL.query(
        "SELECT commands FROM admin_favourites WHERE license = ?",
        [license]
    );
    if (result[0] === undefined) {
        return [];
    }
    return result[0].commands;
}

QBCore.Functions.CreateCallback(
    "iggy-admin:cb:getFavourites",
    async (source: number, cb: (data: string[]) => void) => {
        cb(await loadFavourites(source));
    }
);

onNet("iggy-admin:server:updateFavourites", async (favourites: string[]) => {
    let license = QBCore.Functions.GetIdentifier(source, "license");
    let resp = await MySQL.update(
        "UPDATE admin_favourites SET commands = ? WHERE license = ?",
        [JSON.stringify(favourites), license]
    );
    if (resp === 0) {
        await MySQL.insert(
            "INSERT INTO admin_favourites (license, commands) VALUES (?, ?)",
            [license, JSON.stringify(favourites)]
        );
    }
});

QBCore.Functions.CreateCallback(
    "iggy-admin:cb:hasPerms",
    async (source: number, cb: (data: boolean) => void) => {
        cb(isAdmin(source));
    }
);

function LoadVehicles() {
    let vehicles: OptionChoice[] = [];
    Object.keys(QBCore.Shared.Vehicles).forEach((v) => {
        let vehicle = QBCore.Shared.Vehicles[v];
        let veh = {
            value: v,
            label: `[${vehicle.category}] <strong>${vehicle.name}</strong> [${vehicle.model}]`,
        };
        vehicles.push(veh);
    });
    return vehicles.sort((a, b) => a.label.localeCompare(b.label));
}

QBCore.Functions.CreateCallback(
    "iggy-admin:cb:getVehicles",
    async (source: number, cb: (data: OptionChoice[]) => void) => {
        cb(LoadVehicles());
    }
);

function LoadItems() {
    let vehicles: OptionChoice[] = [];
    Object.keys(QBCore.Shared.Vehicles).forEach((v) => {
        let vehicle = QBCore.Shared.Vehicles[v];
        let veh = {
            value: v,
            label: `[${vehicle.category}] <strong>${vehicle.name}</strong> [${vehicle.model}]`,
        };
        vehicles.push(veh);
    });
    return vehicles.sort((a, b) => a.label.localeCompare(b.label));
}

QBCore.Functions.CreateCallback(
    "iggy-admin:cb:getItems",
    async (source: number, cb: (data: OptionChoice[]) => void) => {
        cb(LoadItems());
    }
);

QBCore.Functions.CreateCallback(
    "iggy-admin:cb:getPlayersCoords",
    async (
        source: number,
        cb: (data: { display: string; coords: number[] }[]) => void
    ) => {
        const Players = QBCore.Functions.GetPlayers();
        let players: { id: number; display: string; coords: number[] }[] = [];
        Players.forEach((serverID: number) => {
            let name = GetPlayerName(serverID.toString());
            let coords = GetEntityCoords(GetPlayerPed(serverID.toString()));
            let player = {
                display: `[${serverID}] ${name}`,
                coords: coords,
                id: serverID,
            };
            players.push(player);
        });
        cb(players);
    }
);

async function loadBinds(src: number): Promise<Bind[]> {
    let license = QBCore.Functions.GetIdentifier(src, "license");
    const result = await MySQL.query(
        "SELECT binds FROM admin_binds WHERE license = ?",
        [license]
    );
    if (result[0] === undefined) {
        return [
            { name: "Bind 1", cmd: null },
            { name: "Bind 2", cmd: null },
            { name: "Bind 3", cmd: null },
            { name: "Bind 4", cmd: null },
            { name: "Bind 5", cmd: null },
        ];
    }
    return result[0].binds;
}

QBCore.Functions.CreateCallback(
    "iggy-admin:cb:getBinds",
    async (source: number, cb: (data: Bind[]) => void) => {
        cb(await loadBinds(source));
    }
);

onNet("iggy-admin:server:updateBinds", async (binds: Bind[]) => {
    let license = QBCore.Functions.GetIdentifier(source, "license");
    let resp = await MySQL.update(
        "UPDATE admin_binds SET binds = ? WHERE license = ?",
        [JSON.stringify(binds), license]
    );
    if (resp === 0) {
        await MySQL.insert(
            "INSERT INTO admin_binds (license, binds) VALUES (?, ?)",
            [license, JSON.stringify(binds)]
        );
    }
});

async function getLogs(): Promise<Log[]> {
    const result = await MySQL.query(
        "SELECT * FROM admin_logs ORDER BY date DESC "
    );
    if (result[0] === undefined) {
        return [];
    }
    return result as Log[];
}

QBCore.Functions.CreateCallback(
    "iggy-admin:cb:getLogs",
    async (source: number, cb: (data: Log[]) => void) => {
        cb(await getLogs());
    }
);

onNet(
    "qb-log:server:CreateLog",
    async (
        name: string,
        title: string,
        color: string,
        message: string,
        tagEveryone: boolean
    ) => {
        MySQL.insert(
            "INSERT INTO admin_logs (type, source, message) VALUES (?, ?, ?)",
            [name, title, message]
        );
    }
);

async function getPlayerVehicles(cid: string): Promise<Vehicle[]> {
    let vehicles = await MySQL.query(
        "SELECT vehicle, plate, state FROM player_vehicles where citizenid = ?",
        [cid]
    );

    if (vehicles[0] === undefined) {
        return [];
    }

    return vehicles as Vehicle[];
}

async function getPlayersData(): Promise<AdminPlayerData[]> {
    const Players = QBCore.Functions.GetPlayers();
    let players: AdminPlayerData[] = [];

    const playerPromises = Players.map(async (serverID: number) => {
        let name = GetPlayerName(serverID.toString());
        let steam = QBCore.Functions.GetIdentifier(serverID, "steam");
        let player: QBPlayer = QBCore.Functions.GetPlayer(serverID);
        let vehicles = await getPlayerVehicles(player.PlayerData.citizenid);
        let charInfo: CharInfo = {
            cid: player.PlayerData.citizenid,
            name:
                player.PlayerData.charinfo.firstname +
                " " +
                player.PlayerData.charinfo.lastname,
            job:
                player.PlayerData.job.label +
                " " +
                player.PlayerData.job.grade.name +
                " " +
                player.PlayerData.job.onduty,
            gang:
                player.PlayerData.gang.label +
                " " +
                player.PlayerData.gang.grade.name,
            phone: player.PlayerData.charinfo.phone,
            bank: player.PlayerData.money["bank"],
            cash: player.PlayerData.money["cash"],
            crypto: player.PlayerData.money["crypto"],
        };
        let data: AdminPlayerData = {
            serverId: serverID,
            username: name,
            steam: steam,
            loggedIn: player.PlayerData.LoggedIn,
            identifiers: getPlayerIdentifiers(serverID).filter(
                (id) => !id.includes("ip:")
            ),
            charInfo: charInfo,
            vehicles: vehicles,
        };
        return data;
    });

    players = await Promise.all(playerPromises);

    return players;
}

QBCore.Functions.CreateCallback(
    "iggy-admin:cb:getPlayersData",
    async (source: number, cb: (data: AdminPlayerData[]) => void) => {
        cb(await getPlayersData());
    }
);
