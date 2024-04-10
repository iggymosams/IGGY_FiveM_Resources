<script lang="ts">
    import { Wifi, GlobeLock } from "lucide-svelte";
    import { onMount } from "svelte";
    import { handle, hasVPN } from "../store/stores";
    import { fade } from "svelte/transition";

    let hover = false;

    let time = new Date();

    $: hours = time.getHours().toString().padStart(2, "0");
    $: minutes = time.getMinutes().toString().padStart(2, "0");

    onMount(() => {
        const interval = setInterval(() => {
            time = new Date();
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    });
</script>

<div class="ml-auto flex h-full items-center text-white">
    {#if $hasVPN}
        <div
            class="relative flex justify-center"
            on:mouseenter={() => (hover = true)}
            on:mouseleave={() => (hover = false)}
            role="dialog"
        >
            <GlobeLock />
            {#if hover}
                <div
                    class="w-max absolute bottom-[100%] transition-all"
                    transition:fade={{ duration: 250 }}
                >
                    <div
                        class="rounded-md p-2 mb-[10px] backdrop-blur-xl bg-opacity-50 bg-neutral-700"
                    >
                        Logged in as {$handle}
                    </div>
                </div>
            {/if}
        </div>
    {:else}
        <Wifi />
    {/if}
    <div class="text-end text-xs p-2">
        <div>{hours}:{minutes}</div>
        <div>27/03/2024</div>
    </div>
</div>
