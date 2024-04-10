import type { Rep } from "../shared/types";
import { oxmysql as MySQL } from "@overextended/oxmysql";

let RepDatabase: { [key: string]: number } = {};

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
    if (RepDatabase[cid] === undefined) {
        await GetRep(cid);
    }
    RepDatabase[cid] += amount;
    await MySQL.update(
        "UPDATE `iggy_player_boosting_rep` SET `rep` = ? WHERE `citizenid` = ?",
        [RepDatabase[cid], cid]
    );
}
global.exports("GiveRep", GiveRep);

export { GetRep, GiveRep };
