<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { type PageData } from "../types";
    import { activeTab } from "../../../store/ridge";
    import { fade } from "svelte/transition";

    export let id: string;
    export let inputValues: PageData;
    let inputVisible = false;
    let value = inputValues[id];

    const dispatch = createEventDispatcher();

    function handleInput() {
        if (!value) {
            value = inputValues[id];
            return;
        }
        const regex = /^(https?:\/\/.*\.(?:jpg|jpeg|png|gif|webp))$/i;

        if (regex.test(value)) {
            dispatch("input", { event: value, id });
        } else {
            value = inputValues[id];
        }
    }
</script>

<div
    class="relative"
    on:mouseenter={() => {
        if ($activeTab.editing) {
            inputVisible = true;
        }
    }}
    on:mouseleave={() => {
        inputVisible = false;
    }}
    role="img"
>
    {#if inputVisible}
        <div
            transition:fade
            class="absolute top-0 w-full h-full bg-black/50 flex items-center justify-center"
        >
            <input
                class="w-1/2 p-1 rounded-md"
                placeholder="Image url..."
                on:change={() => {
                    handleInput();
                }}
                bind:value
                type="url"
            />
        </div>
    {/if}
    <img src={inputValues[id]} />
</div>
