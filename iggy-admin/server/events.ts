import { ToggleCloak, ToggleGodmode } from "./handlers";
import { CommandData, PlayerCoordData } from "../shared/types";
import { Server } from "qbcore.js";
import { GeneratePlate, RegisterAdminCommand } from "./sv_utils";
import { oxmysql as MySQL } from "@overextended/oxmysql";

const QBCore: Server = global.exports["qb-core"].GetCoreObject();

RegisterAdminCommand(
    "iggy-admin:server:reviveSelf",
    (src: number, data: CommandData) => {
        emitNet("hospital:client:Revive", source);
    }
);

RegisterAdminCommand(
    "iggy-admin:server:reviveInDistance",
    (src: number, data: CommandData) => {
        let ped = GetPlayerPed(src.toString());
        let coords = GetEntityCoords(ped);

        getPlayers().forEach((id) => {
            let coords2 = GetEntityCoords(GetPlayerPed(id));
            let dist = global.exports["iggy-utils"].CalcDist(
                coords[0],
                coords[1],
                coords[2],
                coords2[0],
                coords2[1],
                coords[2]
            );
            if (dist <= 3) {
                emitNet("hospital:client:Revive", id);
            }
        });
    }
);

RegisterAdminCommand(
    "iggy-admin:server:reviveTarget",
    (src: number, data: CommandData) => {
        emitNet("hospital:client:Revive", data.target.serverId);
        emitNet(
            "QBCore:Notify",
            src,
            "Revived " + data.target.display,
            "success",
            5000
        );
    }
);

RegisterAdminCommand(
    "iggy-admin:server:toggleCloak",
    (src: number, data: CommandData) => {
        ToggleCloak(src);
    }
);

RegisterAdminCommand(
    "iggy-admin:server:toggleGodMode",
    (src: number, data: CommandData) => {
        ToggleGodmode(src);
    }
);

RegisterAdminCommand(
    "iggy-admin:server:killTarget",
    (src: number, data: CommandData) => {
        emitNet("iggy-admin:client:killTarget", data.target.serverId);
        emitNet(
            "QBCore:Notify",
            src,
            "Killed " + data.target.display,
            "success",
            5000
        );
    }
);

RegisterAdminCommand(
    "iggy-admin:server:freezeTarget",
    (src: number, data: CommandData) => {
        emitNet("iggy-admin:client:freezeTarget", data.target.serverId);
        emitNet(
            "QBCore:Notify",
            src,
            "Toggled Frozen frozen " + data.target.display,
            "success",
            5000
        );
    }
);

RegisterAdminCommand(
    "iggy-admin:server:seatInTargetVehicle",
    (src: number, data: CommandData) => {
        let id = data.target.serverId;
        let admin = GetPlayerPed(src.toString());
        let target = GetPlayerPed(id);
        let vehicle = GetVehiclePedIsIn(target, false);
        let seat: number;

        if (vehicle === 0) {
            emitNet(
                "QBCore:Notify",
                src,
                data.target.display + " is not in a vehicle",
                "error",
                5000
            );
            return;
        }

        for (let i = -1; i < 8 - 1; i++) {
            if (GetPedInVehicleSeat(vehicle, i) === 0) {
                seat = i;
                break;
            }
        }
        if (seat !== undefined) {
            SetPedIntoVehicle(admin, vehicle, seat);
            emitNet(
                "QBCore:Notify",
                src,
                "Warped into " + data.target.display + "'s vehicle",
                "success",
                5000
            );
        } else {
            emitNet(
                "QBCore:Notify",
                src,
                "No empty seats in " + data.target.display + "'s vehicle",
                "error",
                5000
            );
        }
    }
);

RegisterAdminCommand(
    "iggy-admin:server:openInventory",
    (src: number, data: CommandData) => {
        emitNet("iggy-admin:client:openInventory", src, data.target.serverId);
    }
);

RegisterAdminCommand(
    "iggy-admin:server:openClothing",
    (src: number, data: CommandData) => {
        emitNet("iggy-admin:client:openClothing", data.target.serverId);
    }
);

RegisterAdminCommand(
    "iggy-admin:server:openBennys",
    (src: number, data: CommandData) => {
        let id = data.target.serverId;
        let ped = GetPlayerPed(id);
        let coords = GetEntityCoords(ped);
        emitNet("qb-customs:client:EnterCustoms", data.target.serverId, {
            coords: { x: coords[0], y: coords[1], z: coords[2] },
            heading: GetEntityHeading(ped),
            categories: {
                repair: true,
                mods: true,
                armor: true,
                respray: true,
                liveries: true,
                wheels: true,
                tint: true,
                plate: true,
                extras: true,
                neons: true,
                xenons: true,
                horn: true,
                turbo: true,
                cosmetics: true,
            },
        });
    }
);

RegisterAdminCommand(
    "iggy-admin:server:spawnVehicle",
    (src: number, data: CommandData) => {
        let model =
            data.values["override"] !== "" &&
            data.values["override"] !== undefined
                ? data.values["override"]
                : data.values["model"].value;
        emitNet("iggy-admin:client:spawnVehicle", src, model);
    }
);

RegisterAdminCommand(
    "iggy-admin:server:spawnItem",
    (src: number, data: CommandData) => {
        let item = data.values["item"].value;
        let amount = data.values["amount"] || 1;

        let plr = QBCore.Functions.GetPlayer(src);
        plr.Functions.AddItem(item, amount);
        emitNet(
            "inventory:client:ItemBox",
            src,
            QBCore.Shared.Items[item],
            "add"
        );
    }
);

onNet("iggy-admin:server:getPlayerCoords", (data: CommandData) => {
    let src = source;
    const Players = QBCore.Functions.GetPlayers();
    let players: PlayerCoordData[] = [];
    Players.forEach((serverID: number) => {
        let name = GetPlayerName(serverID.toString());
        let ped = GetPlayerPed(serverID.toString());
        let coords = GetEntityCoords(ped);
        let player = {
            display: `[${serverID}] ${name}`,
            coords: coords,
            id: serverID,
            net: NetworkGetNetworkIdFromEntity(ped),
        };
        players.push(player);
    });

    emitNet("iggy-admin:client:updatePlayerCoords", src, players);
});

RegisterAdminCommand(
    "iggy-admin:server:goToTarget",
    (src: number, data: CommandData) => {
        let admin = GetPlayerPed(src.toString());
        let coords = GetEntityCoords(GetPlayerPed(data.target.serverId));
        SetEntityCoords(
            admin,
            coords[0],
            coords[1],
            coords[2],
            true,
            false,
            false,
            false
        );
        emitNet(
            "QBCore:Notify",
            src,
            "Succcessfully teleported to " + data.target.display,
            "success",
            5000
        );
    }
);

RegisterAdminCommand(
    "iggy-admin:server:bringTarget",
    (src: number, data: CommandData) => {
        let player = GetPlayerPed(data.target.serverId);
        let coords = GetEntityCoords(GetPlayerPed(src.toString()));
        SetEntityCoords(
            player,
            coords[0],
            coords[1],
            coords[2],
            true,
            false,
            false,
            false
        );
        emitNet(
            "QBCore:Notify",
            src,
            "Succcessfully brought " + data.target.display,
            "success",
            5000
        );
    }
);

RegisterAdminCommand(
    "iggy-admin:server:weather",
    (src: number, data: CommandData) => {
        let weather: string;
        if (data.values["weather"] !== undefined) {
            weather = data.values["weather"].value;
        }
        let time: number | undefined = data.values["time"] || undefined;
        if (weather !== undefined) {
            global.exports["qb-weathersync"].setWeather(weather);
        }

        if (time !== undefined) {
            const timeString: string = time.toString().padStart(4, "0");
            const hour: string = timeString.slice(0, 2);
            const min: string = timeString.slice(2, 4);

            global.exports["qb-weathersync"].setTime(hour, min);
        }
        emitNet(
            "QBCore:Notify",
            src,
            "Updated Weather and Time",
            "success",
            5000
        );
    }
);

RegisterAdminCommand(
    "iggy-admin:server:kick",
    (src: number, data: CommandData) => {
        let id = data.target.serverId;
        let reason = data.values.reason;
        DropPlayer(
            id,
            "\n🛑 You got kicked from the server! \nReason: " + reason
        );

        emitNet(
            "QBCore:Notify",
            src,
            "Successfully kicked player (" +
                data.target.display +
                ") for: " +
                reason,
            "success",
            5000
        );
    }
);

RegisterAdminCommand(
    "iggy-admin:server:setJob",
    (src: number, data: CommandData) => {
        let plr = QBCore.Functions.GetPlayer(+data.target.serverId);

        plr.Functions.SetJob(
            data.values["job"].value,
            data.values["rank"].value
        );
        emitNet(
            "QBCore:Notify",
            src,
            "Successfully set player (" +
                data.target.display +
                ") job to " +
                data.values["job"].value +
                " " +
                data.values["rank"].value,
            "success",
            5000
        );
    }
);

RegisterAdminCommand(
    "iggy-admin:server:setGang",
    (src: number, data: CommandData) => {
        let plr = QBCore.Functions.GetPlayer(+data.target.serverId);

        plr.Functions.SetGang(
            data.values["gang"].value,
            data.values["rank"].value
        );
        emitNet(
            "QBCore:Notify",
            src,
            "Successfully set player (" +
                data.target.display +
                ") gang to " +
                data.values["gang"].value +
                " " +
                data.values["rank"].value,
            "success",
            5000
        );
    }
);

RegisterAdminCommand(
    "iggy-admin:server:giveMoney",
    (src: number, data: CommandData) => {
        let plr = QBCore.Functions.GetPlayer(+data.target.serverId);
        let amount = +data.values["amount"];
        if (amount > 0) {
            plr.Functions.AddMoney(
                data.values["type"].value,
                amount,
                "Admin Menu"
            );
            emitNet(
                "QBCore:Notify",
                src,
                "Successfully set player (" +
                    data.target.display +
                    ") gang to " +
                    data.values["gang"].value +
                    " " +
                    data.values["rank"].value,
                "success",
                5000
            );
        } else {
            plr.Functions.RemoveMoney(
                data.values["type"].value,
                Math.abs(amount),
                "Admin Menu"
            );
            emitNet(
                "QBCore:Notify",
                src,
                "Successfully set player (" +
                    data.target.display +
                    ") gang to " +
                    data.values["gang"].value +
                    " " +
                    data.values["rank"].value,
                "success",
                5000
            );
        }
    }
);

onNet("iggy-admin:server:SM:deleteEntity", (netId: number) => {
    DeleteEntity(NetworkGetEntityFromNetworkId(netId));
});

RegisterAdminCommand(
    "iggy-admin:server:giveVehicle",
    async (src: number, data: CommandData) => {
        let model = data.values["model"]?.value;
        let plate = data.values["plate"] || GeneratePlate();

        if (model !== undefined) {
            let player = QBCore.Functions.GetPlayer(+data.target.serverId);
            let result = await MySQL.query(
                "SELECT plate FROM player_vehicles WHERE plate = ?"
            );
            if (result[0] !== undefined) {
                return;
            }

            MySQL.insert(
                "INSERT INTO player_vehicles (license, citizenid, vehicle, hash, mods, plate, garage, state) VALUES( ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    player.PlayerData.license,
                    player.PlayerData.citizenid,
                    model,
                    GetHashKey(model),
                    JSON.stringify({}),
                    plate,
                    "pillboxgarage",
                    1,
                ]
            );
            emitNet(
                "QBCore:Notify",
                src,
                "Given " + model + " to " + data.target.display,
                "success",
                5000
            );
        }
    }
);

RegisterAdminCommand(
    "iggy-admin:server:spectate",
    async (src: number, data: CommandData) => {
        let targetped = GetPlayerPed(data.target.serverId);
        let coords = GetEntityCoords(targetped);

        emitNet(
            "iggy-admin:client:spectate",
            src,
            data.target.serverId,
            coords,
            NetworkGetNetworkIdFromEntity(targetped)
        );
    }
);

RegisterAdminCommand(
    "iggy-admin:server:createObject",
    async (src: number, data: CommandData) => {
        let object = data.values["object"];
        emitNet("iggy-admin:client:createObject", src, object);
    }
);

onNet(
    "iggy-admin:server:syncObject",
    (
        obj: string,
        {
            position,
            rotation,
        }: {
            position: {
                x: number;
                y: number;
                z: number;
            };
            rotation: {
                x: number;
                y: number;
                z: number;
            };
        }
    ) => {
        const object = CreateObjectNoOffset(
            GetHashKey(obj),
            position.x,
            position.y,
            position.z,
            true,
            false,
            false
        );
        SetEntityRotation(object, rotation.x, rotation.y, rotation.z, 2, true);
    }
);

RegisterAdminCommand(
    "iggy-admin:server:ban",
    async (src: number, data: CommandData) => {
        let target = +data.target.serverId;
        let minutes = +data.values["duration"].value;
        let reason = data.values["reason"];

        let perm = false;
        let date = new Date();
        date.setMinutes(date.getMinutes() + minutes);

        if (minutes >= 2147483647) {
            perm = true;
        }

        await MySQL.insert(
            "INSERT INTO bans (name, license, discord, ip, reason, expire, bannedby) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                GetPlayerName(target.toString()),
                QBCore.Functions.GetIdentifier(target, "license"),
                QBCore.Functions.GetIdentifier(target, "discord"),
                QBCore.Functions.GetIdentifier(target, "ip"),
                reason,
                perm ? 2147483647 : date.getTime() / 1000,
                GetPlayerName(src.toString()),
            ]
        );

        emit(
            "qb-log:server:CreateLog",
            "bans",
            "Player Banned",
            "red",
            `${GetPlayerName(target.toString())} was banned by ${GetPlayerName(
                src.toString()
            )} for ${reason} `,
            true
        );

        if (perm) {
            DropPlayer(
                target.toString(),
                `🛑 You have been permanently banned:\n${reason}`
            );
        } else {
            DropPlayer(
                target.toString(),
                `🛑 You have been banned:\n${reason}\n\nBan expires: ${date.toLocaleString()}`
            );
        }
    }
);

RegisterAdminCommand(
    "iggy-admin:server:createBoost",
    (src: number, data: CommandData) => {
        let target = data.target.serverId;
        let boost = data.values["boost"].value;
        let rewardRep = data.values["rewardRep"];
        let cost = data.values["cost"];
        let rewardQBit = data.values["rewardQBit"];
        let time = data.values["time"];

        emit(
            "iggy-boosting:server:createContract",
            boost,
            0,
            time,
            cost,
            rewardRep,
            target,
            rewardQBit
        );
    }
);

RegisterAdminCommand(
    "iggy-admin:server:spawnPlayerVehicle",
    async (src: number, data: CommandData) => {
        let vehicle = await MySQL.query(
            "SELECT * FROM player_vehicles where plate = ?",
            [data.values["plate"]]
        );
        if (vehicle[0] === undefined) return;
        let vehData = vehicle[0];

        emitNet(
            "iggy-admin:client:spawnPlayerVehicle",
            src,
            vehData.vehicle,
            vehData.mods,
            vehData.plate,
            vehData.fuel
        );
    }
);

RegisterAdminCommand(
    "iggy-admin:server:openOutfits",
    (src: number, data: CommandData) => {
        emitNet("qb-clothing:client:openOutfitMenu", data.target.serverId);
    }
);
