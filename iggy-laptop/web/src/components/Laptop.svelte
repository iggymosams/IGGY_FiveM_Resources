<script lang="ts">
    import { Router, Route } from "svelte-routing";
    import LaptopVisibilityProvider from "../providers/LaptopVisibilityProvider.svelte";
    import AppBase from "./AppBase.svelte";
    import TaskBar from "./TaskBar.svelte";
    import WallPaperProvider from "../providers/WallPaperProvider.svelte";
    import { settings } from "../store/settingsStore";

    const url = "";
</script>

<LaptopVisibilityProvider>
    <Router {url}>
        <div class="flex-auto">
            <Route path="/">
                <AppBase
                    ><button
                        on:click={() =>
                            ($settings.wallpaper =
                                "https://www.patnickproductions.co.uk/_astro/CroppedLogo.QZ9_ve0X_14vALY.webp")}
                        >Test</button
                    >></AppBase
                >
            </Route>
        </div>
    </Router>
    <TaskBar />
    <WallPaperProvider />
</LaptopVisibilityProvider>
