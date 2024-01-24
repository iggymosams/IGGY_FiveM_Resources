import { VehicleClass, vehicleList } from "../shared/types";
import { RandomNumber } from "../shared/utils";
import { Config } from "../shared/Config";

function filterVehiclesByClass(
    vehicleList: vehicleList,
    targetClass: VehicleClass
): vehicleList {
    return Object.fromEntries(
        Object.entries(vehicleList).filter(
            ([key, value]) => value.class >= targetClass
        )
    );
}

function getCostFromClass(vehClass: VehicleClass): number {
    return Math.floor(
        RandomNumber(
            Config.BOOST_PRICE[vehClass].min,
            Config.BOOST_PRICE[vehClass].max
        )
    );
}
function getRepRewaredFromClass(vehClass: VehicleClass): number {
    return Math.floor(
        RandomNumber(
            Config.REP_REWARD[vehClass].min,
            Config.REP_REWARD[vehClass].max
        )
    );
}

function generateTime(hoursFromNow: number, minutesFromNow: number): number {
    const time = new Date();

    time.setHours(time.getHours() + hoursFromNow);
    time.setMinutes(time.getMinutes() + minutesFromNow);

    return Math.floor(time.getTime() / 1000);
}

export {
    filterVehiclesByClass,
    getCostFromClass,
    getRepRewaredFromClass,
    generateTime,
};
