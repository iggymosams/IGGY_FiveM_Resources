<script lang="ts">
    import { Pyramid } from "lucide-svelte";
    import DateTime from "./DateTime.svelte";
    import { openedApps } from "../store/stores";
    import { flip } from "svelte/animate";
    import { cubicOut } from "svelte/easing";
</script>

<div
    class="backdrop-blur-xl bg-opacity-50 bg-neutral-700 w-full h-10 flex items-center px-2 gap-1"
>
    <button
        class="text-blue-400 p-1.5 rounded-md hover:bg-neutral-500/20 transition-colors"
    >
        <Pyramid />
    </button>
    {#each $openedApps as app (app.name)}
        <button
            class={`p-1 rounded-md ${app.backgroundColor.replace("bg", "text")} hover:bg-neutral-500/20 transition-colors`}
            animate:flip={{ easing: cubicOut, duration: 200 }}
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
            <svelte:component this={app.icon} />
        </button>
    {/each}
    <DateTime />
</div>
