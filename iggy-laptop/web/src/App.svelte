<script lang="ts">
    import { Route, Router } from "svelte-routing";
    import LaptopVisibilityProvider from "./providers/LaptopVisibilityProvider.svelte";
    import { debugData } from "./utils/debugData";
    import "./app.pcss";
    import Laptop from "./components/Laptop.svelte";
    import { settings } from "./store/settingsStore";

    debugData([
        {
            app: "base",
            action: "toggleLaptop",
            data: true,
        },
    ]);
</script>

<main class="h-full flex items-center justify-center overflow-hidden">
    <Laptop />
</main>
