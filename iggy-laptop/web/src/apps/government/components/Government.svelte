<script lang="ts">
    import AppShell from "../../../components/AppShell.svelte";
    import type { LaptopApp } from "../../../utils/apps";
    import HomePage from "./HomePage.svelte";
    import Navbar from "./Navbar.svelte";

    export let app: LaptopApp;
    let minimized = app.minimized;
    let page = "HOME";

    function navigate(newPage: string) {
        page = newPage;
    }
</script>

<AppShell {app} class="bg-slate-200 text-black h-full">
    <Navbar minimized={$minimized} {navigate} />
    <div class="px-16 h-5/6 relative">
        {#if page === "HOME"}
            <HomePage />
            <!-- <StateAnnouncements /> -->
        {:else if page === "DEPARTMENTS"}
            DEPARTMENTS
        {:else if page === "LEADERSHIP"}
            LEADERSHIP
        {:else if page === "LAWS"}
            LAWS
        {:else if page === "FACILITIES"}
            FACILITIES
        {/if}
    </div>
</AppShell>
