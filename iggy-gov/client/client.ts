import { Announcement } from "../shared/types";

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "gov:getInfo",
    async () => {
        emitNet("iggy-gov:server:getAnnouncements");
        emitNet("iggy-gov:server:getCanEdit");
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "gov:newStateAnnouncement",
    async (data: { title: string; message: string }) => {
        emitNet("iggy-gov:server:newStateAnnouncement", data);
    }
);

onNet("iggy-gov:client:getAnnouncements", (announcements: Announcement[]) => {
    global.exports["iggy-laptop"].SendAppMessage(
        "gov",
        "updateAnnouncements",
        announcements
    );
});

onNet("iggy-gov:client:updateCanEdit", (canEdit: boolean) => {
    global.exports["iggy-laptop"].SendAppMessage(
        "gov",
        "updateCanEdit",
        canEdit
    );
});
