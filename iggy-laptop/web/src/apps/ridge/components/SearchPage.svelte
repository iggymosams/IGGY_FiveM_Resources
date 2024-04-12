<script lang="ts">
    import { Mountain, Search } from "lucide-svelte";
    import { type PageData } from "../types";
    import { activeTab } from "../../../store/ridge";
    import { searchURL } from "../utils";

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
        <div
            class="w-full bg-neutral-700 rounded-full text-white p-3 flex items-center focus-within:outline focus-within:outline-2 focus-within:outline-orange-400"
        >
            <Search />
            <input
                class="bg-transparent w-full px-3 focus:outline-none"
                placeholder="Search or go anywhere..."
            />
        </div>
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
