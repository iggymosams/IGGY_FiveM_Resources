<script lang="ts">
    import Icon from "@iconify/svelte";
    export let openSettings: () => void;

    let date = new Date();
</script>

<div class="bg-gray-700 w-full h-10 flex content-baseline text-white gap-3">
    <button class=" bg-blue-500 hover:bg-blue-400 p-1 h-full font-bold">
        MENU
    </button>
    <button
        class="rounded-xl bg-gray-600 h-10 w-10 my-auto p-1 hover:bg-gray-500"
        on:click|preventDefault={openSettings}
    >
        <Icon icon="material-symbols:settings" class="w-full" />
    </button>
    <div class="justify-self-center ml-auto my-auto text-center h-min p-1">
        {date.toLocaleDateString()}
    </div>
</div>
