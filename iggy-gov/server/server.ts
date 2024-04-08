import { Announcement } from "../shared/types";
import { oxmysql as MySQL } from "@overextended/oxmysql";

let announcements: Announcement[];

async function getAnnouncements(): Promise<Announcement[]> {
    if (announcements) return announcements;
    let response = await MySQL.query(
        "select * FROM `iggy_gov_state_announcements` ORDER BY date DESC"
    );
    announcements = response as Announcement[];
    return announcements;
}

onNet("iggy-gov:server:getAnnouncements", async () => {
    let src = source;

    emitNet("iggy-gov:client:getAnnouncements", src, await getAnnouncements());
});

onNet("iggy-gov:server:getCanEdit", () => {
    let src = source;
    emitNet("iggy-gov:client:updateCanEdit", src, true);
});

onNet(
    "iggy-gov:server:newStateAnnouncement",
    async (data: { title: string; message: string }) => {
        let announcement = {
            title: data.title,
            message: data.message,
            date: new Date().getTime(),
        };
        announcements.unshift(announcement);

        emitNet("iggy-gov:client:getAnnouncements", -1, announcements);
        await MySQL.query(
            "INSERT INTO `iggy_gov_state_announcements` (title, message, date) VALUES (?, ?, ?)",
            [announcement.title, announcement.message, announcement.date]
        );
    }
);
