import type { Announcement, Law } from "../shared/types";
import { oxmysql as MySQL } from "@overextended/oxmysql";

let announcements: Announcement[];
let laws: Law[];

async function getAnnouncements(): Promise<Announcement[]> {
    if (announcements) return announcements;
    let response = await MySQL.query(
        "SELECT * FROM `iggy_gov_state_announcements` WHERE `deletedAt` IS NULL ORDER BY date DESC"
    );
    announcements = response as Announcement[];
    return announcements;
}

async function getLaws(): Promise<Law[]> {
    if (laws) return laws;
    let response = await MySQL.query(
        "select * FROM `iggy_gov_laws` ORDER BY id DESC"
    );
    laws = response as Law[];
    return laws;
}

onNet("iggy-gov:server:getAnnouncements", async () => {
    let src = source;
    emitNet("iggy-gov:client:getAnnouncements", src, await getAnnouncements());
});

onNet("iggy-gov:server:getLaws", async () => {
    let src = source;
    emitNet("iggy-gov:client:getLaws", src, await getLaws());
});

onNet("iggy-gov:server:getCanEdit", () => {
    let src = source;
    emitNet("iggy-gov:client:updateCanEdit", src, true);
});

onNet(
    "iggy-gov:server:newStateAnnouncement",
    async (data: { title: string; message: string }) => {
        let date = new Date().toISOString().slice(0, 19).replace("T", " ");
        console.log(date);
        let test = await MySQL.query(
            "INSERT INTO `iggy_gov_state_announcements` (title, message, date) VALUES (?, ?, ?)",
            [data.title, data.message, date]
        );

        let announcement = {
            id: test.insertId,
            title: data.title,
            message: data.message,
            date: date,
        };
        announcements.unshift(announcement);

        emitNet(
            "iggy-gov:client:getAnnouncements",
            -1,
            await getAnnouncements()
        );
    }
);

onNet("iggy-gov:server:saveLaw", async (law: Law) => {
    let response = await MySQL.query(
        "UPDATE `iggy_gov_laws` SET `title` = ?, `html` = ? WHERE `uuid` = ?",
        [law.title, law.html, law.uuid]
    );

    if (response.affectedRows === 0) {
        await MySQL.query(
            "INSERT INTO `iggy_gov_laws` (title, html, uuid) VALUES (?, ?, ?)",
            [law.title, law.html, law.uuid]
        );
        laws.unshift(law);
    } else {
        let i = laws.findIndex((oldLaw) => oldLaw.uuid === law.uuid);
        laws[i] = law;
    }
    emitNet("iggy-gov:client:getLaws", -1, await getLaws());
});

onNet("iggy-gov:server:deleteAnnouncement", async (announcementId: number) => {
    let announcement = announcements.find((a) => a.id === announcementId);

    if (!announcement) {
        return;
    }

    await MySQL.query(
        "UPDATE `iggy_gov_state_announcements` SET `deletedAt` = CURRENT_TIMESTAMP WHERE `id` = ?",
        [announcement.id]
    );

    announcements = announcements.filter((a) => a.id !== announcement.id);
    emitNet("iggy-gov:client:getAnnouncements", -1, await getAnnouncements());
});
