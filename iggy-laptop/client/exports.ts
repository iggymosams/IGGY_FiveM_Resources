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
    // await Delay(300); TODO: Make iggy-utils
    SendAppMessage("base", "toggleLaptop", true);
    SetFocus(hasFocus, hasCursor);
}
global.exports("OpenLaptop", OpenLaptop);

async function CloseLaptop() {
    SetFocus(false, false);
    // await Delay(300);
    isOpen = false;
}
global.exports("CloseLaptop", CloseLaptop);

function SetFocus(hasFocus: boolean, hasCursor: boolean) {
    SetNuiFocus(hasFocus, hasCursor);
    HasFocus = hasFocus;
    HasCursor = hasCursor;
}
global.exports("SetFocus", SetFocus);

export {
    RegisterLaptopCallback,
    SendAppMessage,
    OpenLaptop,
    SetFocus,
    CloseLaptop,
};
