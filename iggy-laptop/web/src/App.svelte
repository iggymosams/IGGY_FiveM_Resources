<script lang="ts">
    import { debugData } from "./utils/debugData";
    import "./app.pcss";
    import Laptop from "./components/Laptop.svelte";
    import HandleEditor from "./components/HandleEditor.svelte";
    import Hack from "./components/Hack.svelte";
    import { useNuiEvent } from "./utils/useNuiEvent";
    import { handle, hasVPN, openedApps, visibility } from "./store/stores";
    import { activeContract, inQueue, rep } from "./store/boosting";

    let restarting = false;

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

    useNuiEvent("base", "restart", async () => {
        restarting = true;

        // Base Stores
        openedApps.set([]);
        visibility.set(false);
        hasVPN.set(false);
        handle.set("");

        // Boosting Stores
        rep.set(undefined);
        inQueue.set(false);
        activeContract.set(undefined);

        await new Promise((resolve) => setTimeout(resolve, 1000));
        restarting = false;
    });
</script>

{#if !restarting}
    <main class="h-full flex items-center justify-center overflow-hidden">
        <Laptop />
        <HandleEditor />
        <Hack />
    </main>
{/if}
