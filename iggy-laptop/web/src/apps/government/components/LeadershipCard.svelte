<script lang="ts">
    export let position: string;
    export let image: string;
    export let name: string;
    export let bio: string;
</script>

<div class="bg-white shadow-md p-4 rounded-lg h-48">
    <p class="mb-2 h-1/6 text-xl font-bold">{position}</p>
    <div class="flex h-5/6 gap-2">
        <div class="h-5/6 aspect-square object-cover">
            <img src={image} alt={name} class="rounded-full" />
        </div>
        <div>
            <h2 class="text-xl font-semibold mb-2">{name}</h2>
            <p class="text-gray-600">{bio}</p>
        </div>
    </div>
</div>
