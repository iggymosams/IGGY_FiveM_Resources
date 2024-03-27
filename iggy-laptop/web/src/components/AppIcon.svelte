<script lang="ts">
    import { Link } from "svelte-routing";
    import type { ConfigApp } from "../utils/apps";

    export let app: ConfigApp;
</script>

<Link to={app.path}>
    <div
        class={`aspect-square backdrop-blur-sm bg-opacity-50 ${app.backgroundColor} ${app.color} rounded-md flex items-center justify-center flex-col hover:bg-opacity-75 transition-colors`}
    >
        <svelte:component this={app.icon} />
        <span class={app.color}>{app.name}</span>
    </div>
</Link>
