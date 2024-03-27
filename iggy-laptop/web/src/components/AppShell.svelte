<script lang="ts">
    import { Link } from "svelte-routing";
    import AppBase from "./AppBase.svelte";
    import { Minimize, Square, X } from "lucide-svelte";

    export let name: string;
</script>

<AppBase>
    <div
        class="w-full h-7 m-0 px-1 bg-neutral-700 text-white flex items-center gap-1"
    >
        <span class="font-bold">{name}</span>
        <div class="flex gap-1 ml-auto">
            <div class="p-0.5 bg-green-500 rounded-md">
                <Minimize size={17} />
            </div>
            <div class="p-0.5 bg-orange-500 rounded-md">
                <Square size={17} />
            </div>
            <Link to="/" class="p-0.5 bg-red-500 rounded-md">
                <X size={17} />
            </Link>
        </div>
    </div>
    <slot />
</AppBase>
