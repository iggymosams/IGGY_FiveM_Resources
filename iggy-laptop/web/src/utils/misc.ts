export const isEnvBrowser = (): boolean => !(window as any).invokeNative;

export function randomID() {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
}
