import type { SvelteComponent } from "svelte";
import Groups from "../apps/groups/components/Groups.svelte";
import type { ComponentType } from "svelte";
import { UsersRound, type Icon, SettingsIcon, CarFront } from "lucide-svelte";
import Settings from "../apps/settings/comonents/Settings.svelte";
import { writable, type Writable } from "svelte/store";
import Boosting from "../apps/boosting/components/Boosting.svelte";

export interface ConfigApp {
    id: string;
    name: string;
    backgroundColor: string;
    color: string;
    disable?: boolean;
    component: typeof SvelteComponent<any>;
    icon: ComponentType<Icon>;
    requiresVPN?: boolean;
}

export type LaptopApp = ConfigApp & {
    minimized: Writable<boolean>;
    top: Writable<number>;
    left: Writable<number>;
};

export const APPS: ConfigApp[] = [
    {
        id: "GROUPS",
        name: "Groups",
        backgroundColor: "bg-purple-400",
        color: "text-white",
        component: Groups,
        icon: UsersRound,
    },
    {
        id: "BOOSTING",
        name: "Boosting",
        backgroundColor: "bg-sky-500",
        color: "text-white",
        component: Boosting,
        icon: CarFront,
        requiresVPN: true,
    },
];

function configToApp(app: ConfigApp): LaptopApp {
    return {
        ...app,
        minimized: writable(false),
        top: writable(0),
        left: writable(0),
    };
}

export function getApps() {
    const apps = APPS.map(configToApp);
    const filterdApps = apps.filter((app) => !app.disable);
    function getApp(id: string): LaptopApp | null {
        return apps.find((app) => app.id === id) || null;
    }
    return { apps: filterdApps, getApp };
}
