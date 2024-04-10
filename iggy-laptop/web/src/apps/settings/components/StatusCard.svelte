<script lang="ts">
    export let onclick: () => void = () => {};
</script>

<button
    on:click={onclick}
    class="text-lg flex items-center justify-center gap-3 p-3 rounded-md hover:backdrop-blur-3xl hover:bg-opacity-20 hover:bg-neutral-700 transition-colors"
>
    <slot />
</button>
