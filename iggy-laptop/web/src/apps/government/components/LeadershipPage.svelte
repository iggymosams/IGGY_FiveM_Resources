<script lang="ts">
    import placeholder from "../assets/Placeholder.jpg";
    import LeadershipCard from "./LeadershipCard.svelte";

    let leadership: {
        name: string;
        position: string;
        image: string;
        bio: string;
    }[] = [
        {
            position: "Mayor of Los Santos",
            name: "Oliver White",
            bio: "The Mayor of Los Santos is responsible for governing the city, managing municipal services, and representing the interests of its residents.",
            image: placeholder,
        },
        {
            position: "Chief Justice",
            name: "Oliver White",
            bio: "The Chief Justice presides over the highest court in the state, ensuring fair and impartial administration of justice and upholding the rule of law.",
            image: placeholder,
        },
        {
            position: "Chief of Police",
            name: "Oliver White",
            bio: "The Chief of Police leads the police department, ensuring public safety, enforcing laws, and combating crime in San Andreas.",
            image: placeholder,
        },
        {
            position: "Sheriff",
            name: "Oliver White",
            bio: "The Sheriff oversees law enforcement operations in Blaine County, ensuring the safety and security of its residents and communities.",
            image: placeholder,
        },
        {
            position: "Chief of Medicine",
            name: "Oliver White",
            bio: "The Chief of Medicine leads the medical team at Los Santos Medical Group, overseeing patient care, medical research, and healthcare services.",
            image: placeholder,
        },
        {
            position: "Chief of EMS",
            name: "Oliver White",
            bio: "The Chief of EMS coordinates emergency medical services, ensuring rapid response and quality care for those in need of medical assistance.",
            image: placeholder,
        },
    ];
</script>

<div
    class="text-left w-full h-full absolute top-0 left-0 px-16 overflow-auto py-3"
>
    <h1 class="text-3xl font-bold mb-4">Leadership</h1>
    <div class="grid grid-cols-2 gap-4 w-full">
        {#each leadership as leader}
            <LeadershipCard
                position={leader.position}
                name={leader.name}
                bio={leader.bio}
                image={leader.image}
            />
        {/each}
    </div>
</div>
