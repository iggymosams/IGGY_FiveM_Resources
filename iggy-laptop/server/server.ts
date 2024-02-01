import { Server } from "@zerio2/qbcore.js";

const QBCore: Server = global.exports["qb-core"].GetCoreObject();

QBCore.Functions.CreateUseableItem("laptop", (src, item) => {
    emitNet("iggy-laptop:client:open", src);
});

onNet(
    "iggy-laptop:server:PlayInDistance",
    (coords: number[], maxDist: number, sound: string, volume: number) => {
        emitNet(
            "iggy-laptop:client:PlayInDistance",
            -1,
            coords,
            maxDist,
            sound,
            volume
        );
    }
);
