<script lang="ts">
    import { Search } from "lucide-svelte";
    import { activeTab } from "../../../store/ridge";
    import { searchURL } from "../utils";

    export let search: string = "";
    let searchInput: HTMLInputElement;

    function handleSearch(event: KeyboardEvent) {
        if (event.key === "Enter") {
            searchURL(search, $activeTab.id);
            searchInput.blur();
        }
    }
</script>

<div
    class="w-full bg-neutral-700 rounded-full text-white p-3 flex items-center focus-within:outline focus-within:outline-2 focus-within:outline-orange-400"
>
    <Search />
    <input
        class="bg-transparent w-full px-3 focus:outline-none"
        placeholder="Search or go anywhere..."
        bind:value={search}
        on:keydown={handleSearch}
        bind:this={searchInput}
    />
</div>
