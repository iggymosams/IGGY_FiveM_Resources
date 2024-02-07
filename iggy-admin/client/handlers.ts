import { RegisterQBCallBack } from "./cl_utils";
import { Delay } from "../shared/utils";
import { DevMode } from "./client";
import { PlayerCoordData } from "../shared/types";
import { Client } from "qbcore.js";

const QBCore: Client = global.exports["qb-core"].GetCoreObject();

let cloaked: { [key: number]: boolean } = {};
let godmode = false;
let frozen = false;
let names = false;
let blips = false;
let blipsData: number[] = [];
let playerCoords: PlayerCoordData[] = [];
let fetching: boolean = false;

let coords = false;
let SpectateEnabled = false;
let StoredTargetPed = null;
let StoredTargetPlayerId = -1;

onNet("QBCore:Client:OnPlayerLoaded", async () => {
    const newCloaked = await RegisterQBCallBack("iggy-admin:cb:getCloaked");
    cloaked = newCloaked;
});

onNet("iggy-admin:client:toggleCloak", (target: number, toggle: boolean) => {
    cloaked[target] = toggle;
});

onNet("iggy-admin:client:toggleGodmode", async (toggle: boolean) => {
    godmode = toggle;
    while (godmode) {
        SetPlayerInvincible(PlayerId(), true);
        await Delay(1);
    }
    SetPlayerInvincible(PlayerId(), false);
});

onNet("iggy-admin:client:freezeTarget", async (toggle: boolean) => {
    frozen = !frozen;
    let ped = PlayerPedId();
    FreezeEntityPosition(ped, frozen);
    let veh = GetVehiclePedIsIn(ped, false);
    if (veh !== 0) FreezeEntityPosition(veh, frozen);
});

onNet("iggy-admin:client:toggleNames", () => {
    names = !names;
});

onNet("iggy-admin:client:toggleBlips", () => {
    blips = !blips;
});

onNet(
    "iggy-admin:client:updatePlayerCoords",
    async (players: PlayerCoordData[]) => {
        playerCoords = players;
        await Delay(1000);
        fetching = false;
    }
);

onNet("iggy-admin:client:displayCoords", async () => {
    coords = !coords;
    while (coords) {
        let coords = GetEntityCoords(PlayerPedId(), true);
        let heading = GetEntityHeading(PlayerPedId());
        let c = {
            x: QBCore.Shared.Round(coords[0], 2),
            y: QBCore.Shared.Round(coords[1], 2),
            z: QBCore.Shared.Round(coords[2], 2),
        };
        heading = QBCore.Shared.Round(heading, 2);

        SetTextFont(4);
        SetTextScale(0.4, 0.4);
        SetTextColour(255, 255, 255, 255);
        SetTextEntry("STRING");
        SetTextEdge(4, 0, 0, 0, 255);
        SetTextOutline();
        AddTextComponentString(`vector4(${c.x}, ${c.y}, ${c.z}, ${heading})`);
        DrawText(0.4, 0.025);
        await Delay(0);
    }
});

async function CloakLoop() {
    while (true) {
        let keys = Object.keys(cloaked);
        keys.forEach((player: string) => {
            let id = GetPlayerFromServerId(+player);
            if (id !== -1) {
                let ped = GetPlayerPed(id);
                let toggle = cloaked[+player];
                if (toggle) {
                    if (ped === PlayerPedId() || DevMode) {
                        SetEntityAlpha(ped, 100, false);
                        if (NetworkIsPlayerConcealed(id)) {
                            NetworkConcealEntity(ped, false);
                            NetworkConcealPlayer(id, false, false);
                            NetworkFadeInEntity(ped, true);
                        }
                    } else {
                        SetEntityAlpha(ped, 0, false);
                        SetEntityLocallyInvisible(ped);
                        NetworkFadeOutEntity(ped, true, false);
                        NetworkConcealEntity(ped, true);
                        NetworkConcealPlayer(id, true, true);
                    }
                    SetPedCanRagdoll(ped, false);
                    SetPedConfigFlag(ped, 52, true);
                    SetPlayerCanBeHassledByGangs(id, false);
                    SetIgnoreLowPriorityShockingEvents(id, true);
                    SetPedCanBeTargettedByPlayer(ped, id, false);
                    SetPedCanBeTargetted(ped, false);
                    SetEveryoneIgnorePlayer(id, true);
                } else {
                    NetworkConcealEntity(ped, false);
                    NetworkConcealPlayer(id, false, false);
                    SetPedConfigFlag(ped, 52, false);
                    SetPedCanBeTargettedByPlayer(ped, id, true);
                    SetPedCanBeTargetted(ped, false);
                    SetEveryoneIgnorePlayer(id, false);
                    SetIgnoreLowPriorityShockingEvents(id, false);
                    SetPlayerCanBeHassledByGangs(id, true);
                    SetEntityAlpha(ped, 255, false);
                    SetPedCanRagdoll(ped, true);
                    cloaked[+player] = undefined;
                }
            }
        });
        if (keys.length === 0) {
            await Delay(500);
        } else {
            await Delay(0);
        }
    }
}

function fetchPlayers() {
    if (!fetching) {
        fetching = true;
        emitNet("iggy-admin:server:getPlayerCoords");
    }
}

//TODO: FIX BLIPS
async function NameBlipLoop() {
    while (true) {
        if (names || blips) {
            fetchPlayers();
            if (names) {
                let numbers: number[] = GetActivePlayers();
                numbers.forEach((id) => {
                    let ped = GetPlayerPed(id);
                    let name = GetPlayerName(id);
                    let coords = GetEntityCoords(ped, true);
                    SetTextScale(1, 1);
                    SetTextFont(4);
                    SetTextProportional(true);
                    SetTextColour(255, 255, 255, 215);
                    SetTextEntry("STRING");
                    SetTextCentre(true);
                    AddTextComponentString(
                        "[" + GetPlayerServerId(id) + "] " + name
                    );
                    SetDrawOrigin(coords[0], coords[1], coords[2] + 1, 0);
                    DrawText(0.0, 0.0);

                    ClearDrawOrigin();
                });
                playerCoords.forEach((player) => {
                    if (!numbers.includes(GetPlayerFromServerId(player.id))) {
                        SetTextScale(1, 1);
                        SetTextFont(4);
                        SetTextProportional(true);
                        SetTextColour(255, 255, 255, 215);
                        SetTextEntry("STRING");
                        SetTextCentre(true);
                        AddTextComponentString(player.display);
                        SetDrawOrigin(
                            player.coords[0],
                            player.coords[1],
                            player.coords[2] + 1,
                            0
                        );
                        DrawText(0.0, 0.0);

                        ClearDrawOrigin();
                    }
                });
            }
            if (blips) {
                playerCoords.forEach((player) => {
                    let ped = GetPlayerPed(GetPlayerFromServerId(player.id));

                    let blip = GetBlipFromEntity(ped);
                    if (!DoesBlipExist(blip)) {
                        if (
                            NetworkIsPlayerActive(
                                GetPlayerFromServerId(player.id)
                            )
                        ) {
                            blip = AddBlipForEntity(ped);
                        } else {
                            blip = AddBlipForCoord(
                                player.coords[0],
                                player.coords[1],
                                player.coords[2]
                            );
                        }
                        SetBlipSprite(blip, 1);
                        ShowHeadingIndicatorOnBlip(blip, true);
                        SetBlipScale(blip, 1.0);
                        SetBlipColour(blip, 38);
                        SetBlipAsShortRange(blip, true);
                        BeginTextCommandSetBlipName("STRING");
                        AddTextComponentString(player.display);
                        EndTextCommandSetBlipName(blip);
                        blipsData.push(blip);
                    }
                });
                blipsData.forEach((blip) => RemoveBlip(blip));
                blipsData = [];
            }
            await Delay(0);
        } else {
            await Delay(1000);
        }
    }
}

function startLoops() {
    CloakLoop();
    NameBlipLoop();
}
startLoops();

function getGodmode(): boolean {
    return godmode;
}
global.exports("getGodmode", getGodmode);

async function ToggleSpectate(targetPed: number, targetPlayerId: number) {
    const playerPed = PlayerPedId();
    if (SpectateEnabled) {
        SpectateEnabled = false;
        NetworkSetInSpectatorModeExtended(false, targetPed, false);
        ClearPedSecondaryTask(playerPed);
        DetachEntity(playerPed, true, false);
        FreezeEntityPosition(playerPed, false);
        emit("QBCore:Notify", "Stopped spectating", "error", 5000);

        StoredTargetPed = null;
    } else {
        StoredTargetPed = targetPed;
        StoredTargetPlayerId = targetPlayerId;
        const targetCoords = GetEntityCoords(targetPed, true);
        RequestCollisionAtCoord(
            targetCoords[0],
            targetCoords[1],
            targetCoords[2]
        );

        while (!HasCollisionLoadedAroundEntity(targetPed)) {
            await Delay(5);
        }

        AttachEntityToEntity(
            playerPed,
            targetPed,
            GetPedBoneIndex(targetPed, 0x8711),
            //POS
            0.0,
            0.0,
            2.0,
            //ROT
            0.0,
            0.0,
            0.0,
            false,
            false,
            false,
            false,
            0,
            false
        );

        NetworkSetInSpectatorModeExtended(true, targetPed, false);
        DoScreenFadeIn(500);
        emit("QBCore:Notify", "Started spectating", "success", 5000);
        SpectateEnabled = true;
    }
}

onNet(
    "iggy-admin:client:spectate",
    async function (
        targetServerId: number,
        coords: number[],
        targetPedNetId: number
    ) {
        const adminPed = PlayerPedId();
        let targetPlayer = GetPlayerFromServerId(targetServerId);

        let targetPed = NetworkGetEntityFromNetworkId(targetPedNetId);

        if (targetPed == adminPed) {
            return emit(
                "chatMessage",
                "SYSTEM",
                [255, 0, 0],
                "You cannot spectate yourself"
            );
        }

        DoScreenFadeOut(200);

        while (!IsScreenFadedOut()) {
            await Delay(10);
        }

        SetEntityCoords(
            adminPed,
            coords[0],
            coords[1],
            coords[2],
            false,
            false,
            false,
            false
        );
        FreezeEntityPosition(adminPed, true);

        let resolvePlayerAttempts = 0;
        let resolvePlayerFailed;

        do {
            if (resolvePlayerAttempts > 100) {
                resolvePlayerFailed = true;
                break;
            }

            await Delay(50);

            if (targetPed !== -1) {
                break;
            }

            targetPlayer = GetPlayerFromServerId(targetServerId);
            resolvePlayerAttempts++;
        } while (true);

        if (resolvePlayerFailed) {
            DoScreenFadeIn(5);
            return;
        }
        DoScreenFadeIn(5);

        ToggleSpectate(targetPed, targetPlayer);
    }
);
