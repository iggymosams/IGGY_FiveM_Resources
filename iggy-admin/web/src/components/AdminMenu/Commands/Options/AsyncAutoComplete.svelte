<script lang="ts">
    import type { OptionChoice } from "../../../../types/types";
    import { fetchNui } from "../../../../utils/fetchNui";
    import { target } from "../../../../store/stores";

    let items: OptionChoice[] = [];
    export let selected: string;
    export let callback: string;
    async function getItems() {
        try {
            let resp = await fetchNui(callback, $target);
            items = resp;
        } catch (error) {
            return [
                {
                    display: "[1] iggymosams [steam:1100001123a30f6]",
                    serverId: "1",
                    name: "iggymosams",
                    id: "steam:1100001123a30f6",
                },
                {
                    display: "[2] iggymosams [steam:1100001123a30f6]",
                    serverId: "2",
                    name: "iggymosams",
                    id: "steam:1100001123a30f6",
                },
            ];
        }
    }

    $: getItems();
</script>

<!-- <AutoComplete
    {items}
    labelFieldName={"label"}
    bind:selectedItem={selected}
    className="w-full"
    placeholder="Target"
/> -->
