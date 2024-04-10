<script lang="ts">
    import { facilities } from "../../../store/government";
    import FacilityCard from "./FacilityCard.svelte";
</script>

<div
    class="text-left w-full h-full absolute top-0 left-0 px-16 overflow-auto py-3"
>
    <h1 class="text-3xl font-bold mb-4">Government Facilities</h1>
    <div class="grid grid-cols-2 gap-4 w-full">
        {#each $facilities as facility}
            <FacilityCard {facility} />
        {/each}
    </div>
</div>
