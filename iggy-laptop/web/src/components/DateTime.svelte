<script lang="ts">
    import { onMount } from "svelte";

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

<div class="ml-auto text-end text-xs p-2 text-white">
    <div>{hours}:{minutes}</div>
    <div>27/03/2024</div>
</div>
