<script lang="ts">
    import { Locate } from "lucide-svelte";
    import type { Facility } from "../types";
    import { fetchNui } from "../../../utils/fetchNui";
    import { sendNotification } from "../../../store/notififcations";

    export let facility: Facility;
</script>

<div class="bg-white shadow-md p-4 rounded-lg flex w-full">
    <div>
        <h2 class="text-xl font-semibold">{facility.name}</h2>
        <h4 class="text-sm mb-2">{facility.location}</h4>
        <p class="text-gray-700">
            {facility.description}
        </p>
    </div>
    <button
        on:click={() => {
            fetchNui("gov:locateFacility", facility);
            sendNotification("GPS Updated", "SUCCESS");
        }}
    >
        <Locate />
    </button>
</div>
