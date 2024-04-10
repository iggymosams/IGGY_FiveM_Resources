<script lang="ts">
    import { onMount } from "svelte";
    import AppShell from "../../../components/AppShell.svelte";
    import type { LaptopApp } from "../../../utils/apps";
    import DepartmentPage from "./DepartmentPage.svelte";
    import FacilitesPage from "./FacilitesPage.svelte";
    import HomePage from "./HomePage.svelte";
    import LawsPage from "./LawsPage.svelte";
    import LeadershipPage from "./LeadershipPage.svelte";
    import Navbar from "./Navbar.svelte";
    import { fetchNui } from "../../../utils/fetchNui";
    import { useNuiEvent } from "../../../utils/useNuiEvent";
    import { canEdit, laws } from "../../../store/government";
    import type { Law } from "../types";

    export let app: LaptopApp;
    let minimized = app.minimized;
    let page = "HOME";

    function navigate(newPage: string) {
        page = newPage;
    }

    useNuiEvent<boolean>("gov", "updateCanEdit", (data) => {
        canEdit.set(data);
    });

    useNuiEvent<Law[]>("gov", "updateLaws", (data) => {
        laws.set(data);
    });

    onMount(() => {
        fetchNui("gov:getInfo");
    });
</script>

<AppShell {app} class="bg-slate-200 text-black h-full">
    <Navbar minimized={$minimized} {navigate} />
    <div class="px-16 h-5/6 relative">
        {#if page === "HOME"}
            <HomePage {navigate} />
        {:else if page === "DEPARTMENTS"}
            <DepartmentPage />
        {:else if page === "LEADERSHIP"}
            <LeadershipPage />
        {:else if page === "LAWS"}
            <LawsPage />
        {:else if page === "FACILITIES"}
            <FacilitesPage />
        {/if}
    </div>
</AppShell>
