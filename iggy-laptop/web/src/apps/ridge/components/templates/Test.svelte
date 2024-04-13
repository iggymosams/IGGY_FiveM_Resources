<script lang="ts">
    import { activeTab } from "../../../../store/ridge";
    import type { PageData } from "../../types";
    import EditableDiv from "../EditableDiv.svelte";
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
        <EditableDiv
            id="input1"
            {inputValues}
            on:input={(data) => {
                let detail = data.detail;
                handleInput(detail.event, detail.id);
            }}
        />

        {JSON.stringify(data)}
        {$activeTab.editing}
        {JSON.stringify(inputValues)}
    </div>
</Template>
