export let isOpen = false;
let HasFocus = false;
let HasCursor = false;

function RegisterLaptopCallback(name: string, callback: Function) {
    RegisterNuiCallbackType(`iggy-laptop:ui:${name}`);
    on(
        `__cfx_nui:iggy-laptop:ui:${name}`,
        async (data: any, cb: (arg0: any) => void) => {
            cb(await callback(data));
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
    hasVPN?: boolean,
    handle?: string
) {
    isOpen = true;
    // await Delay(300); TODO: Make iggy-utils
    SendAppMessage("base", "toggleLaptop", {
        open: true,
        hasVPN: hasVPN,
        handle: handle,
    });
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

type NotificationType = "SUCCESS" | "ERROR";
function SendNotification(
    message: string,
    type: NotificationType,
    duration?: number
) {
    SendAppMessage("base", "notification", {
        message: message,
        type: type,
        duration: duration,
    });
}
global.exports("SendNotification", SendNotification);

export {
    RegisterLaptopCallback,
    SendAppMessage,
    OpenLaptop,
    SetFocus,
    CloseLaptop,
    SendNotification,
};
