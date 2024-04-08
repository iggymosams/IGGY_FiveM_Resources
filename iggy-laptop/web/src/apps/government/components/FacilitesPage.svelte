<script lang="ts">
    import FacilityCard from "./FacilityCard.svelte";

    let facilities: { name: string; location: string; description: string }[] =
        [
            {
                name: "Los Santos City Hall",
                location: "Downtown, Los Santos",
                description:
                    "The administrative center of the city government, housing offices and chambers for city officials and council members.",
            },
            {
                name: "Mission Row Police Departmet",
                location: "Mission Row, Los Santos",
                description:
                    "The headquarters of the Los Santos Police Department, responsible for maintaining law and order in the city.",
            },
            {
                name: "Blaine County Sheriff's Office",
                location: "Sandy Shores, Blaine County",
                description:
                    "The main office of the Blaine County Sheriff's Office, serving the rural areas and towns of Blaine County.",
            },
            {
                name: "Paleto Bay Sheriff's Office",
                location: "Paleto Bay, Blaine County",
                description:
                    "The local office of the Blaine County Sheriff's Office, providing law enforcement services to the residents of Paleto Bay.",
            },
        ];
</script>

<div
    class="text-left w-full h-full absolute top-0 left-0 px-16 overflow-auto py-3"
>
    <h1 class="text-3xl font-bold mb-4">Government Facilities</h1>
    <div class="grid grid-cols-2 gap-4 w-full">
        {#each facilities as facility}
            <FacilityCard
                name={facility.name}
                description={facility.description}
                location={facility.location}
            />
        {/each}
    </div>
</div>
