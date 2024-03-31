<script lang="ts">
    import LaptopVisibilityProvider from "../providers/LaptopVisibilityProvider.svelte";
    import TaskBar from "./TaskBar.svelte";
    import WallPaperProvider from "../providers/WallPaperProvider.svelte";
    import Home from "../apps/home/components/Home.svelte";
    import { getApps } from "../utils/apps";
    import Notifications from "./Notifications.svelte";
    import { openedApps } from "../store/stores";
</script>

<LaptopVisibilityProvider>
    <div class="flex-auto relative">
        <Home />
        {#each $openedApps as app (app.name)}
            <svelte:component this={app.route.component} {app} />
        {/each}
    </div>
    <Notifications />
    <TaskBar />
    <WallPaperProvider />
</LaptopVisibilityProvider>
