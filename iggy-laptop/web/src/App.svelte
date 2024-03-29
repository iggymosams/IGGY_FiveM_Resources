<script lang="ts">
    import { debugData } from "./utils/debugData";
    import "./app.pcss";
    import Laptop from "./components/Laptop.svelte";
    import HandleEditor from "./components/HandleEditor.svelte";

    debugData([
        {
            app: "base",
            action: "toggleLaptop",
            data: {
                open: true,
                hasVPN: true,
                handle: "Handle",
            },
        },
    ]);
</script>

<main class="h-full flex items-center justify-center overflow-hidden">
    <Laptop />
    <HandleEditor />
</main>
