<script lang="ts">
    import AppShell from "../../../components/AppShell.svelte";
    import { activeTab, tabs } from "../../../store/ridge";
    import { openedApps } from "../../../store/stores";
    import type { LaptopApp } from "../../../utils/apps";
    import HomePage from "./HomePage.svelte";
    import Toolbar from "./Toolbar.svelte";

    export let app: LaptopApp;

    $: {
        if ($tabs.length === 0) {
            openedApps.update((apps) => {
                const newApps = apps.filter((a) => a.name !== app.name);
                return [...newApps];
            });
            tabs.update((currentTabs) => [
                ...currentTabs,
                {
                    title: "New Tab",
                    id: "Default Tab",
                    page: { content: HomePage },
                },
            ]);
        }
        if ($activeTab === undefined) {
            $activeTab = $tabs[0];
        }
    }
</script>

<AppShell {app} class="bg-slate-300 flex flex-col relative">
    <div class="absolute w-full h-full flex flex-col">
        <Toolbar />
        <div class="w-full flex-auto overflow-auto">
            <svelte:component this={$activeTab.page.content} />
        </div>
    </div>
</AppShell>
