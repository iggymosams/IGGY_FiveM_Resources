<script lang="ts">
    import type { LaptopApp } from "../utils/apps";
    import { openedApps } from "../store/stores";

    export let app: LaptopApp;

    function openApp() {
        if (!$openedApps.includes(app)) {
            openedApps.update((apps) => {
                return [...apps, app];
            });
        }
    }
</script>

<button
    class={`aspect-square backdrop-blur-sm bg-opacity-50 ${app.backgroundColor} ${app.color} rounded-md flex items-center justify-center flex-col hover:bg-opacity-75 transition-colors h-20`}
    on:click={openApp}
>
    <svelte:component this={app.icon} />
    <span class={app.color}>{app.name}</span>
</button>
