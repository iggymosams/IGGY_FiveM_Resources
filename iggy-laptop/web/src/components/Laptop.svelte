<script lang="ts">
    import { debugData } from "../utils/debugData";
    import { useNuiEvent } from "../utils/useNuiEvent";
    import { fly, blur } from "svelte/transition";
    import AppBar from "./AppBar.svelte";
    import AppIcon from "./AppIcon.svelte";
    import RentalApp from "./Rental/RentalApp.svelte";
    import BoostingApp from "./Boosting/BoostingApp.svelte";
    import GroupsApp from "./Groups/GroupsApp.svelte";
    import TaskBar from "./TaskBar.svelte";
    import Notification from "./Notification.svelte";
    import { onMount } from "svelte";
    import { fetchNui } from "../utils/fetchNui";
    import type { App, notification } from "../types";

    let apps: App[] = [
        {
            id: "rental",
            name: "Rental",
            icon: "material-symbols:directions-car",
            colour: "emerald-400",
            minimized: true,
        },
        {
            id: "boosting",
            name: "Boosting",
            icon: "mdi:engine",
            colour: "sky-500",
            minimized: true,
        },
        {
            id: "groups",
            name: "Groups",
            icon: "clarity:group-solid",
            colour: "violet-500",
            minimized: true,
        },
        {
            id: "settings",
            name: "Settings",
            icon: "material-symbols:settings",
            colour: "gray-400",
            minimized: true,
        },
    ];

    let isVisible = false;

    let notifactions: notification[] = [];
    let backgroundUrl = "";

    let openedApps: App[] = [];
    let focusedApp: string = "";

    let taskBar: TaskBar;

    function openApp(app: App) {
        if (!openedApps.includes(app)) {
            app.minimized = false;
            openedApps = [...openedApps, app];
        } else {
            app.minimized = !app.minimized;
        }
        focusedApp = app.id;
    }

    function closeApp(app: App) {
        openedApps = openedApps.filter((a) => a !== app);
    }

    function minimizeApp(app: App) {
        if (focusedApp !== app.id) {
            focusedApp = app.id;
            if (app.minimized) {
                app.minimized = !app.minimized;
            }
        } else {
            app.minimized = !app.minimized;
            if (app.minimized) {
                focusedApp = "";
            }
        }
        openedApps = [...openedApps];
    }

    useNuiEvent<notification>("base", "notification", (data) => {
        notifactions = [...notifactions, data];
        if (taskBar !== undefined) taskBar.addNotification(data);
        setTimeout(() => {
            notifactions = notifactions.filter((n) => n !== data);
        }, data.duration || 5000);
    });

    interface visibilityData {
        open: boolean;
        backgroundURL: string;
    }
    useNuiEvent<visibilityData>(
        "base",
        "setVisible",
        ({ open, backgroundURL }) => {
            backgroundUrl = backgroundURL;
            isVisible = open;
        }
    );

    onMount(() => {
        const keyHandler = (e: KeyboardEvent) => {
            if (isVisible && ["Escape"].includes(e.code)) {
                fetchNui("hideLaptop");
                isVisible = false;
            }
        };

        window.addEventListener("keydown", keyHandler);

        return () => window.removeEventListener("keydown", keyHandler);
    });

    debugData([
        {
            app: "base",
            action: "setVisible",
            data: {
                open: true,
                backgroundURL: "https://i.imgur.com/9w3jC08.jpeg",
            },
        },
    ]);
</script>

{#if isVisible}
    <div
        transition:fly={{ duration: 200, y: 200 }}
        class={`aspect-video bg-cover w-full relative max-h-full flex flex-col rounded-md overflow-hidden bg-no-repeat bg-white`}
        style={`background-image: url('${backgroundUrl}')`}
    >
        <div class="p-10 flex-auto relative" id="screen">
            {#each openedApps as app}
                {#if !app.minimized}
                    {#if app.id === "settings"}
                        <div
                            class={`w-2/5 h-4/5 bg-neutral-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md text-white overflow-hidden ${
                                focusedApp === app.id ? "z-10" : "z-auto"
                            }`}
                            transition:blur={{ amount: 10, duration: 150 }}
                        >
                            <AppBar
                                closeApp={() => closeApp(app)}
                                minimizeApp={() => minimizeApp(app)}
                                appName={"Settings"}
                            />
                            <h1 class="w-full text-2xl text-center font-bold">
                                Settings
                            </h1>
                            <div class="flex gap-2">
                                <span>Background Image URL</span>
                                <input
                                    class="flex-auto bg-transparent outline outline-2 outline-black rounded-md"
                                    bind:value={backgroundUrl}
                                />
                            </div>
                        </div>
                    {:else}
                        <div
                            class={`w-full h-full absolute top-0 left-0 bg-zinc-800 flex flex-col ${
                                focusedApp === app.id ? "z-10" : "z-auto"
                            }`}
                            id="app"
                            transition:blur={{ amount: 10, duration: 150 }}
                        >
                            <AppBar
                                closeApp={() => closeApp(app)}
                                minimizeApp={() => minimizeApp(app)}
                                appName={app.name}
                            />
                            <div
                                class="w-full flex-auto overflow-hidden"
                                id="appContainer"
                            >
                                {#if app.id === "rental"}
                                    <RentalApp />
                                {:else if app.id === "boosting"}
                                    <BoostingApp />
                                {:else if app.id === "groups"}
                                    <GroupsApp />
                                {/if}
                            </div>
                        </div>
                    {/if}
                {/if}
            {/each}

            <div
                class="w-1/4 h-1/2 absolute bottom-0 right-0 bg-transparent flex flex-col-reverse gap-0.5 p-1 pointer-events-none"
                id="noti"
            >
                {#each notifactions as notification}
                    <Notification
                        type={notification.type}
                        message={notification.message}
                    />
                {/each}
            </div>
            {#each apps as app}
                <AppIcon
                    name={app.name}
                    icon={app.icon}
                    colour={app.colour}
                    onClick={() => openApp(app)}
                />
            {/each}
        </div>
        <TaskBar
            bind:this={taskBar}
            bind:openedApps
            bind:focusedApp
            {minimizeApp}
        />
    </div>
{/if}
