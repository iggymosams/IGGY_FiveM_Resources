<script lang="ts">
    import { GlobeLock, RefreshCw, Settings, Wifi } from "lucide-svelte";
    import AppShell from "../../../components/AppShell.svelte";
    import type { LaptopApp } from "../../../utils/apps";
    import StatusCard from "./StatusCard.svelte";
    import { hasVPN } from "../../../store/stores";
    import { settings } from "../../../store/settingsStore";
    import { onMount } from "svelte";
    import WallpaperCard from "./WallpaperCard.svelte";

    export let app: LaptopApp;

    let checkForUpdates = false;

    let defaultWallpapers = [
        "https://wallpapers.hector.me/wavey/2.1/desktop/Wavey%20Rainbow.jpg",
        "https://wallpapers.hector.me/wavey/2.1/desktop/Wavey%20Shadow.jpg",
    ];

    let isCustom = !defaultWallpapers.includes($settings.wallpaper);
    let customValue = "";
    onMount(() => {
        console.log(
            isCustom,
            defaultWallpapers.includes($settings.wallpaper),
            $settings.wallpaper
        );
        if (isCustom) {
            customValue = $settings.wallpaper;
        }
    });
</script>

<AppShell
    {app}
    class="backdrop-blur-xl bg-opacity-15 bg-neutral-700 text-white px-52 "
>
    <div class="flex py-2">
        <div
            class="text-3xl font-bold flex items-center gap-3 text-left mr-auto"
        >
            <Settings size={48} class="" /> Home
        </div>
        <StatusCard>
            {#if $hasVPN}
                <GlobeLock size={32} class="text-blue-400" />
                <div class="text-left">
                    <div class="font-bold">VPN</div>
                    <div>Connected</div>
                </div>
            {:else}
                <Wifi size={32} class="text-blue-400" />
                <div class="text-left">
                    <div class="font-bold">Wifi</div>
                    <div>Connected</div>
                </div>
            {/if}
        </StatusCard>
        <StatusCard
            onclick={() => {
                if (checkForUpdates) return;
                checkForUpdates = true;
                setTimeout(() => {
                    checkForUpdates = false;
                }, 5000);
            }}
        >
            <RefreshCw
                size={32}
                class={`text-blue-400 ${checkForUpdates ? "animate-spin" : ""}`}
            />
            <div class="text-left">
                <div class="font-bold">IGGY OS</div>
                <div>Check for updates</div>
            </div>
        </StatusCard>
    </div>
    <div class="grid grid-cols-2 gap-3 py-3">
        {#each defaultWallpapers as wp}<WallpaperCard {wp} />{/each}
    </div>
    <div class="w-full flex items-center gap-3">
        <div class="w-max">Custom Background URL</div>
        <input
            class="h-min flex-auto bg-opacity-40 bg-neutral-700 rounded-md p-1"
            bind:value={customValue}
            type="url"
            on:change={(e) => {
                const regex = /\.(jpeg|jpg|gif|png|bmp)$/i;
                if (!regex.test(customValue)) {
                    customValue = isCustom ? $settings.wallpaper : "";
                    return;
                }
                $settings.wallpaper = customValue;
            }}
        />
    </div>
</AppShell>
