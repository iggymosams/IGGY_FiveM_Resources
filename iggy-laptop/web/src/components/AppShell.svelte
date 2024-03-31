<script lang="ts">
    import { Minimize, Square, X } from "lucide-svelte";
    import { openedApps } from "../store/stores";
    import type { LaptopApp } from "../utils/apps";
    import { onMount } from "svelte";

    export let app: LaptopApp;

    let pClass = "";
    export { pClass as class };

    let minimized = app.minimized;

    let laptop = document.getElementById("laptop");
    let laptopRect: DOMRect;

    let moving = false;
    let top = app.top;
    let left = app.left;

    function closeApp() {
        openedApps.update((apps) => {
            const newApps = apps.filter((a) => a.name !== app.name);
            return [...newApps];
        });
    }

    function onMouseMove(e: MouseEvent) {
        if (moving && laptop) {
            laptopRect = laptop.getBoundingClientRect();
            if ($top + e.movementY > laptopRect.height - laptopRect.height / 4)
                return;

            if ($top + e.movementY < 0) return;

            if ($left + e.movementX > laptopRect.width - laptopRect.width / 4)
                return;
            if ($left + e.movementX < -laptopRect.width / 2) return;

            $top += e.movementY;
            $left += e.movementX;
        }
    }

    onMount(() => {
        laptop = document.getElementById("laptop");
    });
</script>

<svelte:window
    on:mousemove={onMouseMove}
    on:mouseup={() => {
        if (moving) moving = false;
    }}
/>

<button
    class={`absolute ${$minimized ? `w-2/3 h-2/3 app rounded-md` : "w-full h-full top-0 left-0"} flex flex-col cursor-default`}
    style="--left: {$left}px; --top: {$top}px"
    on:click={() => {
        $openedApps.push(
            $openedApps.splice(
                $openedApps.findIndex((a) => a.name === app.name),
                1
            )[0]
        );
        openedApps.set($openedApps);
    }}
>
    <div
        class="w-full h-7 bg-neutral-900 text-white flex items-center gap-1 px-2 cursor-move"
        on:mousedown={() => {
            if ($minimized) moving = true;
        }}
        role="button"
        tabindex="0"
    >
        <span class="font-bold">{name}</span>
        <div class="flex gap-1 ml-auto">
            <div class="p-0.5 bg-green-500 hover:bg-green-400 rounded-md">
                <Minimize size={17} />
            </div>
            <button
                class="p-0.5 bg-orange-500 hover:bg-orange-400 rounded-md"
                on:click={() => ($minimized = !$minimized)}
            >
                <Square size={17} />
            </button>
            <button
                class="p-0.5 bg-red-500 hover:bg-red-400 rounded-md"
                on:click={closeApp}
            >
                <X size={17} />
            </button>
        </div>
    </div>
    <div class={`${pClass}  w-full h-full`}>
        <slot />
    </div>
</button>

<style>
    .app {
        top: var(--top);
        left: var(--left);
    }
</style>
