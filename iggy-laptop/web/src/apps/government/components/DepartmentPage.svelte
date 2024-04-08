<script lang="ts">
    import DepartmentCard from "./DepartmentCard.svelte";

    let departments: { name: string; description: string }[] = [
        {
            name: "LSPD",
            description:
                "The LSPD is responsible for maintaining law and order in the city of Los Santos. They enforce traffic laws, investigate crimes, and ensure public safety.",
        },
        {
            name: "BSCO",
            description:
                "The BCSO serves the rural areas and towns of Blaine County. They patrol the countryside, respond to emergencies, and provide law enforcement services to the residents of Blaine County.",
        },
        {
            name: "SASP",
            description:
                "The SASP is the law enforcement agency responsible for policing the entire state of San Andreas. They assist local law enforcement agencies, and ensure the security of the state.",
        },
        {
            name: "DOJ",
            description:
                "The DOJ oversees legal matters and upholds the law in San Andreas. They prosecute criminals, provide legal advice to government agencies, and ensure justice is served within the state.",
        },
        {
            name: "EMS",
            description:
                "EMS provides emergency medical care and transportation to those in need. They respond to medical emergencies, accidents, and natural disasters, saving lives and promoting public health.",
        },
        {
            name: "LSMG",
            description:
                "LSMG is a leading medical provider in Los Santos, offering emergency care, surgeries, and specialized treatments to the city's residents.",
        },
    ];
</script>

<div
    class="text-left w-full h-full absolute top-0 left-0 px-16 overflow-auto py-3"
>
    <h1 class="text-3xl font-bold mb-4">Departments</h1>
    <div class="grid grid-cols-2 gap-4 w-full">
        {#each departments as department}
            <DepartmentCard
                name={department.name}
                description={department.description}
            />
        {/each}
    </div>
</div>
