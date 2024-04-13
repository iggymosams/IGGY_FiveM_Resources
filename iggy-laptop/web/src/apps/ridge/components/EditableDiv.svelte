<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { activeTab } from "../../../store/ridge";
    import type { PageData } from "../types";

    export let id: string;
    export let inputValues: PageData;

    const dispatch = createEventDispatcher();

    let div: HTMLDivElement;

    function handleInput(event: Event) {
        dispatch("input", {
            event: (event.target as HTMLElement).innerText,
            id,
        });
    }
</script>

<div
    contenteditable={$activeTab.editing}
    on:input={(event) => handleInput(event)}
    bind:this={div}
    class="whitespace-pre-wrap"
>
    {inputValues[id]}
</div>
