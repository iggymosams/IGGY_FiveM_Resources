<script lang="ts">
    import Icon from "@iconify/svelte";

    export let closeApp: () => void;
    export let minimizeApp: () => void;
    export let appName: string;
</script>

<div class="w-full h-7 bg-neutral-900 flex items-center px-3">
    <span class="text-white font-bold">{appName}</span>
    <button
        class=" hover:bg-orange-400 h-3/4 bg-orange-500 rounded-full aspect-square ml-auto"
        on:click|preventDefault={minimizeApp}
    >
        <Icon
            icon="material-symbols:minimize-rounded"
            class="w-full h-full text-white"
        />
    </button>
    <button
        class=" hover:bg-red-400 h-3/4 bg-red-500 rounded-full aspect-square ml-2"
        on:click|preventDefault={closeApp}
    >
        <Icon icon="material-symbols:close" class="w-full h-full text-white" />
    </button>
</div>
