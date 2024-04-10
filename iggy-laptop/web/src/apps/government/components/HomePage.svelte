<script lang="ts">
    import QuickLink from "./QuickLink.svelte";
    import StateAnnouncements from "./StateAnnouncements.svelte";

    export let navigate: (page: string) => void;
</script>

<div
    class="text-left w-full h-full absolute top-0 left-0 px-16 overflow-auto py-3 grid grid-cols-9"
>
    <div class="col-span-6">
        <p class="text-2xl">
            Welcome to the official app of the San Andreas Government. As the
            governing body of the state, we are dedicated to serving and
            protecting the citizens of San Andreas. Explore our portal to learn
            more about our departments, services, and how you can engage with
            your government.
        </p>
        <h2 class="pt-3 font-bold text-2xl">Quick Links</h2>
        <ul class="text-lg list-disc list-inside">
            <QuickLink
                title="Departments"
                description="Discover the various departments and agencies that make up the
                    San Andreas Government."
                page="DEPARTMENTS"
                {navigate}
            />
            <QuickLink
                title="Leadership"
                description="Meet the elected officials and key figures leading our state to prosperity."
                page="LEADERSHIP"
                {navigate}
            />
            <QuickLink
                title="Laws & Regulations"
                description="Stay informed about the laws and regulations that govern San Andreas."
                page="LAWS"
                {navigate}
            />
            <QuickLink
                title="Government Facilities"
                description="Locate government facilities across San Andreas, including police stations, hospitals, and city hall."
                page="FACILITIES"
                {navigate}
            />
        </ul>
    </div>
    <StateAnnouncements />
</div>
