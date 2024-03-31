import type { SvelteComponent } from "svelte";
import Groups from "../apps/groups/components/Groups.svelte";
import type { ComponentType } from "svelte";
import { UsersRound, type Icon, SettingsIcon } from "lucide-svelte";
import Settings from "../apps/settings/comonents/Settings.svelte";

export interface ConfigApp {
    id: string;
    name: string;
    backgroundColor: string;
    color: string;
    disable?: boolean;
    component: typeof SvelteComponent<any>;
    icon: ComponentType<Icon>;
}

export const APPS: ConfigApp[] = [
    {
        id: "GROUPS",
        name: "Groups",
        backgroundColor: "bg-purple-400",
        color: "text-white",
        component: Groups,
        icon: UsersRound,
    },
];

export function getApps() {
    const filterdApps = APPS.filter((app) => !app.disable);
    function getApp(id: string): ConfigApp | null {
        return APPS.find((app) => app.id === id) || null;
    }
    return { apps: filterdApps, getApp };
}
