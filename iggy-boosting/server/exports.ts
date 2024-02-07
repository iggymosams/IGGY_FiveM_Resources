import { Rep } from "../shared/types";
import { oxmysql as MySQL } from "@overextended/oxmysql";

let RepDatabase: { [key: string]: number } = {};
let HandleDatabase: { [key: string]: string } = {};

function getRepFromNumber(amount: number): Rep {
    if (amount < 50) {
        return { level: "C", xp: amount, max: 50, min: 0 };
    } else if (amount < 150) {
        return { level: "B", xp: amount, max: 150, min: 50 };
    }
    return { level: "A", xp: amount, max: 300, min: 150 };
}

async function GetRep(cid: string): Promise<Rep> {
    if (RepDatabase[cid]) {
        return getRepFromNumber(RepDatabase[cid]);
    }
    let response = await MySQL.query(
        "select rep FROM `iggy_player_boosting_rep` WHERE `citizenid` = ?",
        [cid]
    );
    if (response[0] !== undefined) {
        RepDatabase[cid] = response[0].rep;
        return getRepFromNumber(response[0].rep);
    } else {
        let id = await MySQL.insert(
            "INSERT INTO `iggy_player_boosting_rep` (citizenid, rep) VALUES (?, ?)",
            [cid, 0]
        );
        RepDatabase[cid] = 0;
        return getRepFromNumber(RepDatabase[0]);
    }
}
global.exports("GetRep", GetRep);

async function GiveRep(cid: string, amount: number) {
    RepDatabase[cid] += amount;
    let response = await MySQL.update(
        "UPDATE `iggy_player_boosting_rep` SET `rep` = ? WHERE `citizenid` = ?",
        [RepDatabase[cid], cid]
    );
}
global.exports("GiveRep", GiveRep);

async function GetHandle(cid: string): Promise<string | undefined> {
    if (HandleDatabase[cid]) {
        return HandleDatabase[cid];
    }
    let response = await MySQL.query(
        "select handle FROM `iggy_player_boosting_handle` WHERE `citizenid` = ?",
        [cid]
    );
    if (response[0] !== undefined) {
        HandleDatabase[cid] = response[0].handle;
        return response[0].handle;
    } else {
        return undefined;
    }
}
global.exports("GetHandle", GetHandle);

async function SetHandle(cid: string, handle: string): Promise<boolean> {
    let response = await MySQL.query(
        "select citizenid FROM `iggy_player_boosting_handle` WHERE `handle` = ?",
        [handle]
    );

    if (response[0] !== undefined) {
        return false;
    }
    await MySQL.insert(
        "INSERT INTO `iggy_player_boosting_handle` (citizenid, handle) VALUES (?, ?)",
        [cid, handle]
    );
    HandleDatabase[cid] = handle;
    return true;
}
global.exports("SetHandle", SetHandle);

export { GetRep, GiveRep, GetHandle, SetHandle };
