<script lang="ts">
    import type { OptionChoice } from "../../../../types/types";
    import { fetchNui } from "../../../../utils/fetchNui";
    import { target } from "../../../../store/stores";
    import AutoComplete from "./AutoComplete.svelte";

    let items: OptionChoice[] = [];
    export let selected: string;
    export let callback: string;
    export let name: string;
    export let data: { [key: string]: string };

    async function getItems(fetchData: { [key: string]: string }) {
        try {
            let resp = await fetchNui(callback, {
                target: $target,
                values: data,
            });
            items = resp;
        } catch (error) {
            return [];
        }
    }

    $: getItems(data);
</script>

<AutoComplete
    {items}
    labelFieldName={"label"}
    bind:selectedItem={selected}
    placeholder={name}
/>
