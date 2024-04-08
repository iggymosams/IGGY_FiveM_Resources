<script lang="ts">
    import AppShell from "../../../components/AppShell.svelte";
    import type { LaptopApp } from "../../../utils/apps";
    import Navbar from "./Navbar.svelte";
    import QuickLink from "./QuickLink.svelte";
    import StateAnnouncements from "./StateAnnouncements.svelte";

    export let app: LaptopApp;
    let minimized = app.minimized;
    let page = "HOME";

    function navigate(newPage: string) {
        page = newPage;
    }
</script>

<!-- TODO: FIX OVERFLOW -->
<AppShell {app} class="bg-slate-200 text-black ">
    <Navbar minimized={$minimized} {navigate} />
    <div class="flex px-16 py-3 h-[88%]">
        {#if page === "HOME"}
            <div class="text-left w-full">
                <p class="text-2xl">
                    Welcome to the official app of the San Andreas Government.
                    As the governing body of the state, we are dedicated to
                    serving and protecting the citizens of San Andreas. Explore
                    our portal to learn more about our departments, services,
                    and how you can engage with your government.
                </p>
                <h2 class="pt-3 font-bold text-2xl">Quick Links</h2>
                <ul class="text-lg list-disc list-inside">
                    <QuickLink
                        title="Departments"
                        description="Discover the various departments and agencies that make up the
                    San Andreas Government."
                    />
                    <QuickLink
                        title="Leadership"
                        description="Meet the elected officials and key figures leading our state to prosperity."
                    />
                    <QuickLink
                        title="Laws & Regulations"
                        description="Stay informed about the laws and regulations that govern San Andreas."
                    /><QuickLink
                        title="Government Facilities"
                        description="Locate government facilities across San Andreas, including police stations, hospitals, and city hall."
                    />
                </ul>
            </div>
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
