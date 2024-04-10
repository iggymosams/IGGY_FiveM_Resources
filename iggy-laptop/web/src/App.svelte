<script lang="ts">
    import { debugData } from "./utils/debugData";
    import "./app.pcss";
    import Laptop from "./components/Laptop.svelte";
    import HandleEditor from "./components/HandleEditor.svelte";
    import Hack from "./components/Hack.svelte";
    import { useNuiEvent } from "./utils/useNuiEvent";
    import { handle, hasVPN, openedApps, visibility } from "./store/stores";
    import { activeContract, contracts, inQueue, rep } from "./store/boosting";
    import { group, groups, isGroupHost, requests } from "./store/groups";
    import {
        announcements,
        canEdit,
        facilities,
        laws,
        leadership,
    } from "./store/government";

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
        contracts.set([]);
        activeContract.set(undefined);

        // Group Stores
        groups.set([]);
        group.set(undefined);
        isGroupHost.set(false);
        requests.set([]);

        // Government Stores
        canEdit.set(false);
        announcements.set([]);
        laws.set([]);
        facilities.set([]);
        leadership.set([]);

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
