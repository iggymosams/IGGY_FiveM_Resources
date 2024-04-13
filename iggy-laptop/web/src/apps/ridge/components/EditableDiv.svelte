<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { activeTab, selectedElement } from "../../../store/ridge";
    import type { PageData } from "../types";

    export let id: string;
    export let inputValues: PageData;

    const dispatch = createEventDispatcher();

    let div: HTMLDivElement;

    function handleInput(event: Event) {
        dispatch("input", { event, id });
    }
</script>

<div
    contenteditable={$activeTab.editing}
    on:input={(event) => handleInput(event)}
    on:focus={() => {
        $selectedElement = div;
    }}
    bind:this={div}
    class="whitespace-pre-wrap"
>
    {inputValues[id]}
</div>
