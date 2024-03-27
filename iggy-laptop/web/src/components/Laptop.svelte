<script lang="ts">
    import { Router, Route } from "svelte-routing";
    import LaptopVisibilityProvider from "../providers/LaptopVisibilityProvider.svelte";
    import TaskBar from "./TaskBar.svelte";
    import WallPaperProvider from "../providers/WallPaperProvider.svelte";
    import Home from "../apps/home/components/Home.svelte";

    const url = "/";
</script>

<LaptopVisibilityProvider>
    <Router {url}>
        <div class="flex-auto">
            <Route path="/">
                <Home />
            </Route>
        </div>
    </Router>
    <TaskBar />
    <WallPaperProvider />
</LaptopVisibilityProvider>
