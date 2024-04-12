<script lang="ts">
    import { activeTab } from "../../../../store/ridge";
    import type { PageData } from "../../types";
    import Template from "../Template.svelte";

    export let data: PageData;

    let inputValues: PageData = {};

    for (const key in data) {
        inputValues[key] = data[key];
    }

    function handleInput(event: Event, key: string) {
        const newValue = (event.target as HTMLElement).innerText;
        inputValues[key] = newValue;
    }
</script>

<Template pageData={inputValues}>
    <div
        class="w-full h-full flex flex-col items-center justify-center gap-2 bg-neutral-300"
    >
        <div
            contenteditable={$activeTab.editing}
            on:input={(event) => handleInput(event, "input1")}
        >
            {inputValues["input1"]}
        </div>

        {JSON.stringify(data)}
        {$activeTab.editing}
        {JSON.stringify(inputValues)}
    </div>
</Template>
