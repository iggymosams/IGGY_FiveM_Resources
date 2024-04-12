<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    function handleClick() {
        dispatch("click");
    }
</script>

<button class="hover:bg-neutral-600 p-1 rounded-md" on:click={handleClick}>
    <slot />
</button>
