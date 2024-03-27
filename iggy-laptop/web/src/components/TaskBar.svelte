<script lang="ts">
    import { Pyramid } from "lucide-svelte";
    import DateTime from "./DateTime.svelte";
</script>

<div
    class="backdrop-blur-xl bg-opacity-50 bg-neutral-700 w-full h-10 flex items-center px-2"
>
    <button
        class="text-blue-400 p-1.5 rounded-sm hover:bg-neutral-500/20 transition-colors"
    >
        <Pyramid />
    </button>
    <DateTime />
</div>
