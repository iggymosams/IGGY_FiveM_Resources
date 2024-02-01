import { CalcDist, Delay } from "../shared/utils";

export let isOpen = false;
let HasFocus = false;
let HasCursor = false;
let laptopObj;

function RegisterLaptopCallback(name: string, callback: Function) {
    RegisterNuiCallbackType(`iggy-laptop:ui:${name}`);
    on(
        `__cfx_nui:iggy-laptop:ui:${name}`,
        (data: any, cb: (arg0: any) => void) => {
            cb(callback(data));
        }
    );
    console.log(`Created Callback: iggy-laptop:ui:${name}`);
}
global.exports("RegisterLaptopCallback", RegisterLaptopCallback);

function SendAppMessage(app: string, action: string, data?: unknown) {
    SendNuiMessage(
        JSON.stringify({
            app: app,
            action: action,
            data: data,
        })
    );
}
global.exports("SendAppMessage", SendAppMessage);

async function OpenLaptop(
    hasFocus: boolean,
    hasCursor: boolean,
    hasVPN?: boolean
) {
    isOpen = true;
    doAnimation();
    await Delay(300);
    SendAppMessage("base", "setVisible", {
        open: true,
        backgroundURL: "https://i.imgur.com/9w3jC08.jpeg", //TODO: Load from database
        hasVPN: hasVPN || false,
    });
    SetFocus(hasFocus, hasCursor);
}
global.exports("OpenLaptop", OpenLaptop);

function SetFocus(hasFocus: boolean, hasCursor: boolean) {
    SetNuiFocus(hasFocus, hasCursor);
    HasFocus = hasFocus;
    HasCursor = hasCursor;
}
global.exports("SetFocus", SetFocus);

function GetFocus(): { hasFocus: boolean; hasCursor: boolean } {
    return { hasFocus: HasFocus, hasCursor: HasCursor };
}
global.exports("GetFocus", GetFocus);

async function CloseLaptop() {
    SetFocus(false, false);
    await Delay(300);
    isOpen = false;
}
global.exports("CloseLaptop", CloseLaptop);

function GetIsOpen(): boolean {
    return isOpen;
}
global.exports("GetIsOpen", GetIsOpen);

async function doAnimation() {
    if (!isOpen) return;
    let laptopDict = "amb@code_human_in_bus_passenger_idles@female@tablet@base";
    let laptopAnim = "base";
    let laptopProp = GetHashKey("prop_cs_tablet");

    RequestAnimDict(laptopDict);
    while (!HasAnimDictLoaded(laptopDict)) {
        await Delay(10);
    }

    RequestModel(laptopProp);
    while (!HasModelLoaded(laptopProp)) {
        await Delay(10);
    }

    let ped = PlayerPedId();
    laptopObj = CreateObject(laptopProp, 0.0, 0.0, 0.0, true, true, false);
    let tabletBoneIndex = GetPedBoneIndex(ped, 60309);

    AttachEntityToEntity(
        laptopObj,
        ped,
        tabletBoneIndex,
        0.03,
        0.002,
        -0.0,
        10.0,
        160.0,
        0.0,
        true,
        false,
        false,
        false,
        2,
        true
    );
    SetModelAsNoLongerNeeded(laptopProp);

    while (isOpen) {
        await Delay(0);
        if (!IsEntityPlayingAnim(ped, laptopDict, laptopAnim, 3)) {
            TaskPlayAnim(
                ped,
                laptopDict,
                laptopAnim,
                3.0,
                3.0,
                -1,
                49,
                0,
                false,
                false,
                false
            );
        }
    }
    ClearPedSecondaryTask(ped);
    await Delay(250);
    DetachEntity(laptopObj, true, false);
    DeleteEntity(laptopObj);
}

function PlaySound(sound: string, volume: number) {
    SendAppMessage("base", "playSound", {
        sound: sound,
        volume: volume,
    });
}
global.exports("PlaySound", PlaySound);

function PlayInDistance(
    coords: number[],
    maxDist: number,
    sound: string,
    volume: number
) {
    emitNet(
        "iggy-laptop:server:PlayInDistance",
        coords,
        maxDist,
        sound,
        volume
    );
}
global.exports("PlayInDistance", PlayInDistance);

export {
    RegisterLaptopCallback,
    SendAppMessage,
    OpenLaptop,
    SetFocus,
    GetFocus,
    CloseLaptop,
    GetIsOpen,
    PlaySound,
};
