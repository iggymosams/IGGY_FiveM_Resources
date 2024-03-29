<script lang="ts">
    import { flip } from "svelte/animate";
    import { fly } from "svelte/transition";
    import { notifications } from "../store/notififcations";
    import { cubicIn, cubicOut, quadInOut } from "svelte/easing";
    import { CircleCheck, CircleX } from "lucide-svelte";
</script>

<div class="absolute bottom-10 right-0">
    {#each $notifications as notif (notif.id)}
        <div
            class={`p-3 backdrop-blur-xl bg-opacity-50 ${notif.type === "SUCCESS" ? "bg-green-500" : ""}  ${notif.type === "ERROR" ? "bg-red-500" : ""} m-2 rounded-md flex text-white gap-3`}
            animate:flip={{ duration: 400, easing: quadInOut }}
            in:fly={{ x: 300, easing: cubicOut }}
            out:fly={{ x: 500, easing: cubicIn }}
        >
            {#if notif.type === "SUCCESS"}
                <CircleCheck />
            {:else if notif.type === "ERROR"}
                <CircleX />
            {/if}
            {notif.message}
        </div>
    {/each}
</div>
