import { Player, Server } from "@zerio2/qbcore.js";
import { oxmysql as MySQL } from "@overextended/oxmysql";
import { PageData, SearchResult, Site } from "../shared/types";

const QBCore: Server = global.exports["qb-core"].GetCoreObject();

let tlds = [".org", ".dev", ".com"];

function containsTLD(url: string): boolean {
    const regex = new RegExp(tlds.join("|").replace(/\./g, "\\.") + "$", "i");
    return regex.test(url);
}

QBCore.Functions.CreateCallback(
    "iggy-ridge:cb:searchURL",
    async (src, cb: (data: Site | SearchResult[]) => void, args: unknown[]) => {
        let search: string = args[0] as string;
        let isUrl = containsTLD(search);
        if (isUrl) {
            let data = await MySQL.query(
                "SELECT * FROM `iggy_ridge_website` WHERE `url` = ?",
                [search]
            );
            let site = {
                title: data[0].title,
                url: data[0].url,
                page: {
                    template: data[0].template,
                    data: data[0].data,
                },
            };
            cb(site);
        } else {
            let data = await MySQL.query(
                "SELECT `url`, `title` FROM `iggy_ridge_website` WHERE `url` LIKE CONCAT('%', ?, '%') OR `title` LIKE CONCAT('%', ?, '%') ",
                [search, search]
            );
            let results: SearchResult[] = data as SearchResult[];
            cb(results);
        }
    }
);

QBCore.Functions.CreateCallback(
    "iggy-ridge:cb:isSiteOwner",
    async (src, cb: (data: any) => void, args: unknown[]) => {
        let player: Player = QBCore.Functions.GetPlayer(src);

        let url: string = args[0] as string;

        let data = await MySQL.query(
            "SELECT owner FROM `iggy_ridge_website` WHERE `url` = ?",
            [url]
        );
        cb(player.PlayerData.citizenid === data[0].owner);
    }
);

onNet("iggy-ridge:server:saveSite", (url: string, data: PageData) => {
    MySQL.update("UPDATE `iggy_ridge_website` SET data = ? WHERE `url` = ?", [
        JSON.stringify(data),
        url,
    ]);
});
