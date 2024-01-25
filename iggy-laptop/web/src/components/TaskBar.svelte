<script lang="ts">
    import Icon from "@iconify/svelte";
    import Notification from "./Notification.svelte";
    import type { App, notification } from "../types";
    import { slide } from "svelte/transition";

    let date = new Date();
    let showNotification = false;
    let storedNotifactions: notification[] = [];

    export let openedApps: App[];
    export let focusedApp: string;
    export let minimizeApp: (app: App) => void;
    export function addNotification(notification: notification) {
        storedNotifactions = [...storedNotifactions, notification];
    }

    function removeNotification(data: notification) {
        storedNotifactions = storedNotifactions.filter((n) => n !== data);
    }
</script>

{#if showNotification}
    <div
        transition:slide={{ duration: 150, axis: "x" }}
        class="w-1/4 h-1/2 absolute bottom-10 right-0 flex flex-col-reverse gap-0.5 p-1 bg-transparent"
    >
        {#each storedNotifactions as notification}
            <Notification
                type={notification.type}
                message={notification.message}
                onClick={() => removeNotification(notification)}
            />
        {/each}
    </div>
{/if}
<div
    class="bg-neutral-700 w-full h-10 flex content-baseline text-white gap-3 items-center"
>
    <button class=" bg-blue-500 hover:bg-blue-400 p-1 h-full font-bold">
        MENU
    </button>
    {#each openedApps as app}
        <button
            class={`aspect-square h-[90%] rounded-full p-1 text-${app.colour} ${
                focusedApp === app.id ? "bg-neutral-600" : "bg-neutral-800"
            } `}
            on:click={() => minimizeApp(app)}
        >
            <Icon icon={app.icon} class="w-full h-full" />
        </button>
    {/each}

    <div
        class="p-0.5 text-center items-center text-xs flex gap-2 justify-self-end ml-auto"
    >
        <button class="w-4 aspect-square flex-none">
            <Icon icon="mdi:wifi" class="h-full w-full" />
        </button>
        <button
            class="w-4 aspect-square flex-none"
            on:click={() => (showNotification = !showNotification)}
        >
            {#if storedNotifactions.length > 0}
                <Icon icon="mdi:bell-ring" class="h-full w-full" />
            {:else}
                <Icon icon="mdi:bell-outline" class="h-full w-full" />
            {/if}
        </button>
        <div class="h-full flex flex-col items-center justify-center m-1">
            <div>
                {date.toLocaleTimeString("en-GB", { timeStyle: "short" })}
            </div>
            <div>
                {date.toLocaleDateString()}
            </div>
        </div>
    </div>
</div>
