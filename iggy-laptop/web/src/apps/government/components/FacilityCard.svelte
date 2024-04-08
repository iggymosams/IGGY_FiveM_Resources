<script lang="ts">
    import { Locate } from "lucide-svelte";

    export let name: string;
    export let location: string;
    export let description: string;
</script>

<div class="bg-white shadow-md p-4 rounded-lg flex w-full">
    <div>
        <h2 class="text-xl font-semibold">{name}</h2>
        <h4 class="text-sm mb-2">{location}</h4>
        <p class="text-gray-700">
            {description}
        </p>
    </div>
    <button><Locate /></button>
</div>
