import { Config } from "../shared/Config";
import { Announcement, Facility, Law } from "../shared/types";

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "gov:getInfo",
    async () => {
        emitNet("iggy-gov:server:getAnnouncements");
        emitNet("iggy-gov:server:getCanEdit");
        emitNet("iggy-gov:server:getLaws");
        global.exports["iggy-laptop"].SendAppMessage(
            "gov",
            "updateFacilities",
            Config.Facilities
        );
        );
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "gov:newStateAnnouncement",
    async (data: { title: string; message: string }) => {
        emitNet("iggy-gov:server:newStateAnnouncement", data);
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "gov:saveLaw",
    async (law: Law) => {
        emitNet("iggy-gov:server:saveLaw", law);
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "gov:deleteAnnouncement",
    async (announcement: number) => {
        emitNet("iggy-gov:server:deleteAnnouncement", announcement);
    }
);

global.exports["iggy-laptop"].RegisterLaptopCallback(
    "gov:locateFacility",
    async (facility: Facility) => {
        let f = Config.Facilities.find((f) => f.name === facility.name);
        SetNewWaypoint(f.coords.x, f.coords.y);
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

onNet("iggy-gov:client:getLaws", (laws: Law[]) => {
    global.exports["iggy-laptop"].SendAppMessage("gov", "updateLaws", laws);
});
