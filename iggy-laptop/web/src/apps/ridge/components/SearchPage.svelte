<script lang="ts">
    import { Mountain, Search } from "lucide-svelte";
    import { type PageData } from "../types";
    import { activeTab } from "../../../store/ridge";
    import { searchURL } from "../utils";
    import SearchInput from "./SearchInput.svelte";

    export let data: PageData;
</script>

<div
    class="w-full h-full gap-2 bg-neutral-600 pt-2 px-8 text-left overflow-auto"
>
    <div class="flex w-2/5 gap-2 items-center">
        <div class="flex items-center gap-1 text-lg text-white">
            <Mountain class="text-orange-400 h-full" size={28} />
            Ridge
        </div>
        <SearchInput />
    </div>
    <span class="font-light text-neutral-400">Ridge found these results</span>
    <div>
        {#each JSON.parse(data["results"]) as result}
            <button
                class="w-2/5 flex flex-col gap-2 p-3 text-left"
                on:click={() => {
                    searchURL(result.url, $activeTab.id);
                }}
            >
                <div class="flex gap-2 text-green-300">
                    <Mountain size={20} class="text-orange-400" />
                    <span>https://{result.url}</span>
                </div>
                <div class="text-3xl text-blue-400">{result.title}</div>
            </button>
        {/each}
    </div>
</div>
