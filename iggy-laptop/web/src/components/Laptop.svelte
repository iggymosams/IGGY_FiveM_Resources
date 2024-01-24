<script lang="ts">
    import { visibility } from "../store/stores";
    import { debugData } from "../utils/debugData";
    import { useNuiEvent } from "../utils/useNuiEvent";
    import { fly, blur } from "svelte/transition";
    import AppBar from "./AppBar.svelte";
    import AppIcon from "./AppIcon.svelte";
    import RentalApp from "./Rental/RentalApp.svelte";
    import BoostingApp from "./Boosting/BoostingApp.svelte";
    import TaskBar from "./TaskBar.svelte";
    import Notification from "./Notification.svelte";
    import { onMount } from "svelte";
    import { fetchNui } from "../utils/fetchNui";

    interface notification {
        type: "ERROR" | "SUCCESS";
        message: string;
        duration?: number;
    }

    let isVisible = false;

    let notifactions: notification[] = [];
    let backgroundUrl = "";

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

    let appOpened = false;
    let openedApp = "";

    let settingsOpen = false;

    function openApp(app: string) {
        appOpened = true;
        openedApp = app;
    }

    function closeApp() {
        appOpened = false;
        openedApp = "";
    }

    function openSettings() {
        settingsOpen = !settingsOpen;
    }

    function closeSettings() {
        settingsOpen = false;
    }

    useNuiEvent<notification>("base", "notification", (data) => {
        notifactions = [...notifactions, data];

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
        },
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
</script>

{#if isVisible}
    <div
        transition:fly={{ duration: 200, y: 200 }}
        class={`aspect-video bg-cover w-full relative max-h-full flex flex-col rounded-md overflow-hidden bg-no-repeat bg-white`}
        style={`background-image: url('${backgroundUrl}')`}
    >
        <div class=" p-10 flex-auto relative" id="screen">
            {#if appOpened}
                <div
                    class="w-full h-full absolute top-0 left-0 bg-zinc-800 flex flex-col"
                    id="app"
                    transition:blur={{ amount: 10, duration: 150 }}
                >
                    <AppBar {closeApp} />
                    <div
                        class="w-full flex-auto overflow-hidden"
                        id="appContainer"
                    >
                        {#if openedApp === "rental"}
                            <RentalApp />
                        {:else if openedApp === "boosting"}
                            <BoostingApp />
                        {/if}
                    </div>
                </div>
            {/if}
            {#if settingsOpen}
                <div
                    class="w-2/5 h-4/5 bg-gray-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md text-white overflow-hidden"
                    transition:blur={{ amount: 10, duration: 150 }}
                >
                    <AppBar closeApp={closeSettings} />
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
            {/if}
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
            <AppIcon
                name="Rentals"
                icon="material-symbols:directions-car"
                colour="text-emerald-400"
                onClick={() => openApp("rental")}
            />
            <AppIcon
                name="Boosting"
                icon="mdi:engine"
                colour="text-sky-500"
                onClick={() => openApp("boosting")}
            />
        </div>
        <TaskBar {openSettings} />
    </div>
{/if}
