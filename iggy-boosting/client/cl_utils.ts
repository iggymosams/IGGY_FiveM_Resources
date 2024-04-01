import { Client } from "@zerio2/qbcore.js";

const QBCore: Client = global.exports["qb-core"].GetCoreObject();

// TODO: MAKE IGGY_UTILS
async function TriggerQBCallBack(name: string, ...args: any[]) {
    try {
        let data = await new Promise<any>((resolve, reject) => {
            QBCore.Functions.TriggerCallback(
                name,
                (result: any) => {
                    resolve(result);
                },
                args
            );
        });
        return data;
    } catch (error) {
        return;
    }
}

export { TriggerQBCallBack };