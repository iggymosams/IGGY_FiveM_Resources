import { writable } from "svelte/store";
import config from "../config/default.json";
import { isValid } from "../utils/settingsSchema";

const storageKey = "iggy-laptop-settings";

export interface LaptopSettings {
    wallpaper: string;
}

function defaultConfig() {
    return { ...config };
}

function getLocalStorage() {
    const localSettings = localStorage.getItem(storageKey);

    if (localSettings === "undefined" || !localSettings) {
        console.log("No Settings");
        return defaultConfig();
    }

    try {
        const valid = isValid(localSettings);

        const settingsValue: LaptopSettings = valid
            ? JSON.parse(localSettings)
            : defaultConfig();

        if (!valid) {
            console.error("Error loading settings. Reseting to default.");
        }

        //TODO: NUI FETCH SETTINGS UPDATE
        return settingsValue;
    } catch (error) {
        console.error(error);
        return defaultConfig();
    }
}

export const settings = writable<LaptopSettings>(getLocalStorage());

settings.subscribe((value) => {
    //TODO: NUI FETCH SETTINGS UPDATE
    const isDefaultValue =
        JSON.stringify(value) === JSON.stringify(defaultConfig());
    if (isDefaultValue) {
        localStorage.removeItem(storageKey);
    } else {
        localStorage.setItem(storageKey, JSON.stringify(value));
    }
});
