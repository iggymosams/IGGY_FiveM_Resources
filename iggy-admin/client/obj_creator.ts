import { setOpen } from "./client";
import { Delay } from "../shared/utils";
import { RegisterNuiCallback, SendMenuMessage } from "./cl_utils";

let creatingObj = false;

let order = 2;
export async function openTransformControls(obj: number): Promise<{
    position: {
        x: number;
        y: number;
        z: number;
    };
    rotation: {
        x: number;
        y: number;
        z: number;
    };
}> {
    FreezeEntityPosition(obj, true);
    SetEntityCollision(obj, false, false);
    let pos = GetEntityCoords(obj, false);
    let rot = GetEntityRotation(obj, order);
    SendMenuMessage("setTransformEntity", {
        object: obj,
        position: { x: pos[0], y: pos[1], z: pos[2] },
        rotation: { x: rot[0], y: rot[1], z: rot[2] },
    });

    creatingObj = true;
    SetNuiFocus(true, true);
    setOpen(true);

    while (creatingObj) {
        const cpos = GetFinalRenderedCamCoord();
        const crot = GetFinalRenderedCamRot(order);
        SendMenuMessage("setCameraPostion", {
            position: { x: cpos[0], y: cpos[1], z: cpos[2] },
            rotation: { x: crot[0], y: crot[1], z: crot[2] },
        });
        await Delay(0);
    }
    pos = GetEntityCoords(obj, false);
    rot = GetEntityRotation(obj, order);
    let data = {
        position: { x: pos[0], y: pos[1], z: pos[2] },
        rotation: { x: rot[0], y: rot[1], z: rot[2] },
    };
    return data;
}
global.exports("openTransformControls", openTransformControls);

RegisterNuiCallback(
    "moveObject",
    (data: {
        object: number;
        position: {
            x: number;
            y: number;
            z: number;
        };
        rotation: {
            x: number;
            y: number;
            z: number;
        };
    }) => {
        let object = data.object;
        let pos = data.position;
        let rot = data.rotation;

        SetEntityCoords(object, pos.x, pos.y, pos.z, true, false, false, false);
        SetEntityRotation(object, rot.x, rot.y, rot.z, 5, false);
    }
);

RegisterNuiCallback("placeObject", () => {
    setOpen(false);
    creatingObj = false;
    SetNuiFocus(false, false);
    SendMenuMessage("setTransformEntity", {
        object: undefined,
    });
});

RegisterNuiCallback("updatePos", (obj: number) => {
    let pos = GetEntityCoords(obj, false);
    let rot = GetEntityRotation(obj, order);
    SendMenuMessage("setTransformEntity", {
        object: obj,
        position: { x: pos[0], y: pos[1], z: pos[2] },
        rotation: { x: rot[0], y: rot[1], z: rot[2] },
    });
});

RegisterNuiCallback("placeObjectOnGround", (obj: number) => {
    PlaceObjectOnGroundProperly(obj);
    let pos = GetEntityCoords(obj, false);
    let rot = GetEntityRotation(obj, order);
    SendMenuMessage("setTransformEntity", {
        object: obj,
        position: { x: pos[0], y: pos[1], z: pos[2] },
        rotation: { x: rot[0], y: rot[1], z: rot[2] },
    });
});

onNet("iggy-admin:client:createObject", async (obj: string) => {
    const playerPed = PlayerPedId();

    const offset = GetOffsetFromEntityInWorldCoords(playerPed, 0, 0.0, 0);

    const hash = GetHashKey(obj);
    RequestModel(hash);
    let waiting = 0;
    while (!HasModelLoaded(hash)) {
        waiting = waiting + 100;
        await Delay(100);
        if (waiting > 5000) {
            TriggerEvent(
                "QBCore:Notify",
                "Could not load the model in time, a crash was prevented.",
                "error",
                5000
            );
            return;
        }
    }
    const object = CreateObject(
        hash,
        offset[0],
        offset[1],
        offset[2],
        false,
        false,
        false
    );
    SetEntityAlpha(object, 153, true);

    const data = await openTransformControls(object);

    DeleteObject(object);
    emitNet("iggy-admin:server:syncObject", obj, data);
});
