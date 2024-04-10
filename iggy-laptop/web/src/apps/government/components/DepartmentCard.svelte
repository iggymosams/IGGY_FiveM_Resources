<script lang="ts">
    export let name: string;
    export let description: string;
</script>

<div class="bg-white shadow-md p-4 rounded-lg flex flex-col w-full">
    <h2 class="text-xl font-semibold mb-2">{name}</h2>
    <p class="text-gray-700">
        {description}
    </p>
</div>
