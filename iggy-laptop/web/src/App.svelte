<script lang="ts">
    import { debugData } from "./utils/debugData";
    import "./app.pcss";
    import Laptop from "./components/Laptop.svelte";

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
