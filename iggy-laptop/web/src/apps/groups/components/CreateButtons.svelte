<script lang="ts">
    export let onClick: () => void;
</script>

<button
    class="w-full bg-zinc-600 p-3 rounded-md text-3xl font-bold flex flex-col justify-center items-center hover:bg-zinc-500 transition-colors"
    on:click={onClick}
>
    <slot />
</button>
