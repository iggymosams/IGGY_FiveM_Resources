<script lang="ts">
    import { leadership } from "../../../store/government";
    import LeadershipCard from "./LeadershipCard.svelte";
</script>

<div
    class="text-left w-full h-full absolute top-0 left-0 px-16 overflow-auto py-3"
>
    <h1 class="text-3xl font-bold mb-4">Leadership</h1>
    <div class="grid grid-cols-2 gap-4 w-full">
        {#each $leadership as leader}
            <LeadershipCard
                position={leader.position}
                name={leader.name}
                bio={leader.bio}
                image={leader.image}
            />
        {/each}
    </div>
</div>
