<script lang="ts">
    import { Link } from "svelte-routing";
    import type { ConfigApp } from "../utils/apps";

    export let app: ConfigApp;
</script>

<Link to={app.path}>
    <div
        class={`aspect-square ${app.backgroundColor} ${app.color} rounded-md flex items-center justify-center flex-col`}
    >
        <svelte:component this={app.icon} />
        <span class={app.color}>{app.name}</span>
    </div>
</Link>
