<script lang="ts">
    import { useNuiEvent } from "../utils/useNuiEvent";
    import { fetchNui } from "../utils/fetchNui";
    import { onMount } from "svelte";
    import { visibility } from "../store/stores";
    import { fly } from "svelte/transition";

    let isVisible: boolean;

    visibility.subscribe((visible) => {
        isVisible = visible;
    });

    useNuiEvent<boolean>("base", "toggleLaptop", (visible) => {
        visibility.set(visible);
    });

    onMount(() => {
        const keyHandler = (e: KeyboardEvent) => {
            if (isVisible && ["Escape"].includes(e.code)) {
                fetchNui("hideUI");
                visibility.set(false);
            }
        };

        window.addEventListener("keydown", keyHandler);

        return () => window.removeEventListener("keydown", keyHandler);
    });
</script>

{#if isVisible}
    <div
        transition:fly={{ duration: 200, y: 200 }}
        class="aspect-video rounded-md w-5/6 relative overflow-hidden flex flex-col"
    >
        <slot />
    </div>
{/if}
