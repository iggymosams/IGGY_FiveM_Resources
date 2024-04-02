import { Delay } from "../shared/utils";

let noClipEnabled: boolean = false;
let noClipCam: number | null = null;

let speed: number = 1.0;
const maxSpeed: number = 32.0;
const minY: number = -89.0;
const maxY: number = 89.0;

let inputRotEnabled: boolean = false;

async function toggleNoclip() {
    const ped: number = PlayerPedId();
    let veh: number = GetVehiclePedIsIn(ped, false);
    let inVehicle: boolean = false;
    let ent: number;
    if (veh !== 0) {
        inVehicle = true;
        ent = veh;
    } else {
        ent = ped;
    }

    const pos = GetEntityCoords(ent, true);
    const rot = GetEntityRotation(ent, 5);

    noClipCam = CreateCamWithParams(
        "DEFAULT_SCRIPTED_CAMERA",
        pos[0],
        pos[1],
        pos[2],
        0.0,
        0.0,
        rot[2],
        75.0,
        true,
        2
    );

    AttachCamToEntity(noClipCam, ent, 0.0, 0.0, 0.0, true);
    RenderScriptCams(true, false, 3000, true, false);

    FreezeEntityPosition(ent, true);
    SetEntityCollision(ent, false, false);
    SetEntityAlpha(ent, 0, true);
    SetPedCanRagdoll(ped, false);
    SetEntityVisible(ent, false, false);
    ClearPedTasksImmediately(ped);

    if (inVehicle) {
        FreezeEntityPosition(ped, true);
        SetEntityCollision(ped, false, false);
        SetEntityAlpha(ped, 0, true);
        SetEntityVisible(ped, false, false);
    }

    while (noClipEnabled) {
        const [rv, fv, uv, campos] = GetCamMatrix(noClipCam);

        if (IsDisabledControlPressed(2, 17)) {
            speed = Math.min(speed + 0.1, maxSpeed);
        } else if (IsDisabledControlPressed(2, 16)) {
            speed = Math.max(0.1, speed - 0.1);
        }

        let multiplier: number = 1.0;

        if (IsDisabledControlPressed(2, 209)) {
            multiplier = 2.0;
        } else if (IsDisabledControlPressed(2, 19)) {
            multiplier = 4.0;
        } else if (IsDisabledControlPressed(2, 36)) {
            multiplier = 0.25;
        }

        if (IsDisabledControlPressed(2, 32)) {
            let setpos = GetEntityCoords(ent, true);
            setpos[0] = setpos[0] + fv[0] * (speed * multiplier);
            setpos[1] = setpos[1] + fv[1] * (speed * multiplier);
            setpos[2] = setpos[2] + fv[2] * (speed * multiplier);

            SetEntityCoordsNoOffset(
                ent,
                setpos[0],
                setpos[1],
                setpos[2],
                true,
                false,
                false
            );

            if (inVehicle) {
                SetEntityCoordsNoOffset(
                    ped,
                    setpos[0],
                    setpos[1],
                    setpos[2],
                    true,
                    false,
                    false
                );
            }
        } else if (IsDisabledControlPressed(2, 33)) {
            let setpos = GetEntityCoords(ent, true);

            setpos[0] = setpos[0] - fv[0] * (speed * multiplier);
            setpos[1] = setpos[1] - fv[1] * (speed * multiplier);
            setpos[2] = setpos[2] - fv[2] * (speed * multiplier);
            SetEntityCoordsNoOffset(
                ent,
                setpos[0],
                setpos[1],
                setpos[2],
                true,
                false,
                false
            );

            if (inVehicle) {
                SetEntityCoordsNoOffset(
                    ped,
                    setpos[0],
                    setpos[1],
                    setpos[2],
                    true,
                    false,
                    false
                );
            }
        }

        if (IsDisabledControlPressed(2, 34)) {
            const setpos = GetOffsetFromEntityInWorldCoords(
                ent,
                -(speed * multiplier),
                0.0,
                0.0
            );
            SetEntityCoordsNoOffset(
                ent,
                setpos[0],
                setpos[1],
                setpos[2],
                true,
                false,
                false
            );

            if (inVehicle) {
                SetEntityCoordsNoOffset(
                    ped,
                    setpos[0],
                    setpos[1],
                    setpos[2],
                    true,
                    false,
                    false
                );
            }
        } else if (IsDisabledControlPressed(2, 35)) {
            const setpos = GetOffsetFromEntityInWorldCoords(
                ent,
                speed * multiplier,
                0.0,
                0.0
            );
            SetEntityCoordsNoOffset(
                ent,
                setpos[0],
                setpos[1],
                setpos[2],
                true,
                false,
                false
            );

            if (inVehicle) {
                SetEntityCoordsNoOffset(
                    ped,
                    setpos[0],
                    setpos[1],
                    setpos[2],
                    true,
                    false,
                    false
                );
            }
        }

        if (IsDisabledControlPressed(2, 51)) {
            const setpos = GetOffsetFromEntityInWorldCoords(
                ent,
                0.0,
                0.0,
                (multiplier * speed) / 2
            );
            SetEntityCoordsNoOffset(
                ent,
                setpos[0],
                setpos[1],
                setpos[2],
                true,
                false,
                false
            );

            if (inVehicle) {
                SetEntityCoordsNoOffset(
                    ped,
                    setpos[0],
                    setpos[1],
                    setpos[2],
                    true,
                    false,
                    false
                );
            }
        } else if (IsDisabledControlPressed(2, 52)) {
            const setpos = GetOffsetFromEntityInWorldCoords(
                ent,
                0.0,
                0.0,
                (multiplier * -speed) / 2
            );
            SetEntityCoordsNoOffset(
                ent,
                setpos[0],
                setpos[1],
                setpos[2],
                true,
                false,
                false
            );

            if (inVehicle) {
                SetEntityCoordsNoOffset(
                    ped,
                    setpos[0],
                    setpos[1],
                    setpos[2],
                    true,
                    false,
                    false
                );
            }
        }

        const camrot = GetCamRot(noClipCam, 2);
        SetEntityHeading(ent, (360 + camrot[2]) % 360.0);

        SetEntityVisible(ent, false, false);
        if (inVehicle) {
            SetEntityVisible(ped, false, false);
        }

        DisableControlAction(2, 32, true);
        DisableControlAction(2, 33, true);
        DisableControlAction(2, 34, true);
        DisableControlAction(2, 35, true);
        DisableControlAction(2, 36, true);
        DisableControlAction(2, 12, true);
        DisableControlAction(2, 13, true);
        DisableControlAction(2, 14, true);
        DisableControlAction(2, 15, true);
        DisableControlAction(2, 16, true);
        DisableControlAction(2, 17, true);

        DisablePlayerFiring(PlayerId(), true);
        await Delay(0);
    }

    DestroyCam(noClipCam, false);
    noClipCam = null;
    RenderScriptCams(false, false, 3000, true, false);
    FreezeEntityPosition(ent, false);
    SetEntityCollision(ent, true, true);
    SetEntityAlpha(ent, 255, true);
    SetPedCanRagdoll(ped, true);
    SetEntityVisible(ent, true, true);
    ClearPedTasksImmediately(ped);
    ResetEntityAlpha(ped);

    if (inVehicle) {
        FreezeEntityPosition(ped, false);
        SetEntityCollision(ped, true, true);
        SetEntityAlpha(ped, 255, true);
        SetEntityVisible(ped, true, true);
        SetPedIntoVehicle(ped, ent, -1);
        ResetEntityAlpha(ent);
    }
}

async function checkInputRotation() {
    let rotz;
    let rotx;
    while (inputRotEnabled) {
        while (noClipCam === null) {
            await Delay(0);
        }

        const rightAxisX: number = GetDisabledControlNormal(0, 220);
        const rightAxisY: number = GetDisabledControlNormal(0, 221);

        if (Math.abs(rightAxisX) > 0 && Math.abs(rightAxisY) > 0) {
            const rotation = GetCamRot(noClipCam, 2);
            rotz = rotation[2] + rightAxisX * -10.0;

            const yValue: number = rightAxisY * -5.0;

            rotx = rotation[0];

            if (rotx + yValue > minY && rotx + yValue < maxY) {
                rotx = rotation[0] + yValue;
            }

            SetCamRot(noClipCam, rotx, rotation[1], rotz, 2);
        }

        await Delay(0);
    }
}

export function ToggleNoClipMode() {
    const isEnabled: boolean = !noClipEnabled;
    noClipEnabled = isEnabled;
    inputRotEnabled = isEnabled;

    if (noClipEnabled && inputRotEnabled) {
        toggleNoclip();
        checkInputRotation();
    }
}
