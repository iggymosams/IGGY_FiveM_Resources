<script lang="ts">
    import { Router, Route } from "svelte-routing";
    import LaptopVisibilityProvider from "../providers/LaptopVisibilityProvider.svelte";
    import TaskBar from "./TaskBar.svelte";
    import WallPaperProvider from "../providers/WallPaperProvider.svelte";
    import Home from "../apps/home/components/Home.svelte";
    import { getApps } from "../utils/apps";

    const url = "/";

    const { apps } = getApps();
</script>

<LaptopVisibilityProvider>
    <Router {url}>
        <div class="flex-auto">
            <Route path="/">
                <Home />
            </Route>
            {#each apps as app}
                <Route path={app.path}>
                    <svelte:component this={app.route.component} {app} />
                </Route>
            {/each}
        </div>
    </Router>
    <TaskBar />
    <WallPaperProvider />
</LaptopVisibilityProvider>
