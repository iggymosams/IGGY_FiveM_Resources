<script lang="ts">
    import type { ConfigApp } from "../utils/apps";
    import { openedApps } from "../store/stores";

    export let app: ConfigApp;

    function openApp() {
        openedApps.update((apps) => {
            return [...apps, app];
        });
    }
</script>

<button
    class={`aspect-square backdrop-blur-sm bg-opacity-50 ${app.backgroundColor} ${app.color} rounded-md flex items-center justify-center flex-col hover:bg-opacity-75 transition-colors`}
    on:click={openApp}
>
    <svelte:component this={app.icon} />
    <span class={app.color}>{app.name}</span>
</button>
