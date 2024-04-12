<script lang="ts">
    import { Mountain } from "lucide-svelte";
    import SearchInput from "./SearchInput.svelte";
</script>

<div
    class="w-full h-full flex flex-col items-center justify-center gap-2 bg-neutral-600"
>
    <Mountain size={70} class="text-orange-400" />
    <div class="text-6xl font-semibold mb-3 text-white">
        Welcome to <span class=" font-bold text-orange-400">Ridge</span> Browser
    </div>
    <div class="w-2/5">
        <SearchInput />
    </div>
</div>
