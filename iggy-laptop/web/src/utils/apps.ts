import type { SvelteComponent } from "svelte";
import Groups from "../apps/groups/components/Groups.svelte";
import type { ComponentType } from "svelte";
import { UsersRound, type Icon } from "lucide-svelte";

export interface RouteConfig {
    id: string;
    path: string;
    component: typeof SvelteComponent<any>;
}

export interface ConfigApp {
    id: string;
    name: string;
    backgroundColor: string;
    color: string;
    path: string;
    disable?: boolean;
    route: RouteConfig;
    icon: ComponentType<Icon>;
}

export const APPS: ConfigApp[] = [
    {
        id: "GROUPS",
        name: "Groups",
        backgroundColor: "bg-red-500",
        color: "text-white",
        path: "/groups",
        route: { id: "GROUPS", path: "/groups", component: Groups },
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
