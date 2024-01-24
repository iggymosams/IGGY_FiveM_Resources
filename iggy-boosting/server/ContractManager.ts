import { GetRep } from "./exports";
import { VEHICLES } from "../shared/Vehicles";
import { RandomNumber } from "../shared/utils";
import { Contract, VehicleClass } from "../shared/types";
import {
    getCostFromClass,
    getRepRewaredFromClass,
    generateTime,
    filterVehiclesByClass,
} from "./ContractUtils";

let currentId = 1;
let contracts: Contract[] = [];

function CreateContract(
    vehClass: VehicleClass,
    name: string,
    model: string,
    rewardRep: number,
    cost: number,
    rewardCrypto: number,
    time: number,
    target: number
) {
    let contract: Contract = {
        class: vehClass,
        name: name,
        model: model,
        cost: cost,
        rewardRep: rewardRep,
        rewardCrypto: rewardCrypto,
        time: time,
        id: currentId,
    };
    currentId++;
    contracts.push(contract);
    emitNet("iggy-boosting:client:newContract", target, contract);
}

async function GenerateContract(cid: string, target: number) {
    let rep = await GetRep(cid);

    let filteredVeh = filterVehiclesByClass(VEHICLES, rep.level);

    const vehicles = Object.values(filteredVeh);
    const randomIndex = Math.floor(Math.random() * vehicles.length);

    let vehicle = vehicles[randomIndex];
    let cost = getCostFromClass(vehicle.class);
    let reward = Math.floor((cost === 0 ? 1 : cost) * RandomNumber(1, 3));
    CreateContract(
        vehicle.class,
        vehicle.name,
        vehicle.model,
        getRepRewaredFromClass(vehicle.class),
        cost,
        reward,
        generateTime(1, 0),
        target
    );
}

function DeleteContract(source: number, id: number) {
    emitNet("iggy-boosting:client:removeContract", source, id);
    contracts = contracts.filter((contract) => contract.id !== id);
}

function FindContractById(id: number): Contract {
    return contracts.find((contract) => {
        return contract.id === id;
    });
}

export { CreateContract, GenerateContract, DeleteContract, FindContractById };
