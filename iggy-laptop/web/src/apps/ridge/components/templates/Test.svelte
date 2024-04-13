<script lang="ts">
    import { activeTab } from "../../../../store/ridge";
    import type { PageData } from "../../types";
    import EditableDiv from "../EditableDiv.svelte";
    import EditableImage from "../EditableImage.svelte";
    import Template from "../Template.svelte";

    export let data: PageData;

    let inputValues: PageData = {
        input1: "Hello World",
        image1: "http://i.iggymosams.dev/u/RLENOv.png",
    };

    for (const key in data) {
        inputValues[key] = data[key];
    }

    function handleInput(event: string, key: string) {
        const newValue = event;
        inputValues[key] = newValue;
    }
</script>

<Template pageData={inputValues}>
    <div class="flex flex-col items-center justify-center gap-2 bg-neutral-300">
        <EditableDiv
            id="input1"
            {inputValues}
            on:input={(data) => {
                let detail = data.detail;
                handleInput(detail.event, detail.id);
            }}
        />

        <EditableImage
            id="image1"
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
