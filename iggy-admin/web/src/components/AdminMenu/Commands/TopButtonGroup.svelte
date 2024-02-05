<script lang="ts">
    export let selected: string;

    function updateSelected(newSelected: string) {
        selected = newSelected;
    }
    let tabs = ["ALL", "PLAYER", "UTILITY", "USER"];
</script>

<div class="flex">
    {#each tabs as tab}
        <button
            class={`h-full flex-auto ${
                selected === tab ? "bg-rose-700" : "bg-neutral-800"
            } text-white px-1 py-2 transition-colors duration-50`}
            on:click|preventDefault={() => updateSelected(tab)}
        >
            {tab}
        </button>
    {/each}
</div>
