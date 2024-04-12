<script lang="ts">
    import { Mountain, Search } from "lucide-svelte";
</script>

<div
    class="w-full h-full flex flex-col items-center justify-center gap-2 bg-neutral-600"
>
    <Mountain size={70} class="text-orange-400" />
    <div class="text-6xl font-semibold mb-3 text-white">
        Welcome to <span class=" font-bold text-orange-400">Ridge</span> Browser
    </div>
    <div
        class="w-2/5 bg-neutral-700 rounded-full text-white p-3 flex items-center focus-within:outline focus-within:outline-2 focus-within:outline-orange-400"
    >
        <Search />
        <input
            class="bg-transparent w-full px-3 focus:outline-none"
            placeholder="Search or go anywhere..."
        />
    </div>
</div>
