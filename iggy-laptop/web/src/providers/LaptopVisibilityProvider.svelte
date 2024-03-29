<script lang="ts">
    import { useNuiEvent } from "../utils/useNuiEvent";
    import { fetchNui } from "../utils/fetchNui";
    import { onMount } from "svelte";
    import { handle, hasVPN, visibility } from "../store/stores";
    import { fly } from "svelte/transition";

    let isVisible: boolean;

    visibility.subscribe((visible) => {
        isVisible = visible;
    });

    interface toggleLaptopData {
        open: boolean;
        hasVPN: boolean;
        handle: string;
    }
    useNuiEvent<toggleLaptopData>("base", "toggleLaptop", (data) => {
        visibility.set(data.open);
        hasVPN.set(data.hasVPN);
        handle.set(data.handle);
    });

    onMount(() => {
        const keyHandler = (e: KeyboardEvent) => {
            if (isVisible && ["Escape"].includes(e.code)) {
                fetchNui("closeLaptop");
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
        class="aspect-video w-5/6 relative overflow-hidden flex flex-col"
    >
        <slot />
    </div>
{/if}
