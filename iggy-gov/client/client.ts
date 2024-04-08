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

onNet("iggy-gov:client:getAnnouncements", (announcements: any) => {
    global.exports["iggy-laptop"].SendAppMessage(
        "government",
        "updateAnnouncements",
        announcements
    );
});

onNet("iggy-gov:client:updateCanEdit", (canEdit: boolean) => {
    global.exports["iggy-laptop"].SendAppMessage(
        "government",
        "updateCanEdit",
        canEdit
    );
});
