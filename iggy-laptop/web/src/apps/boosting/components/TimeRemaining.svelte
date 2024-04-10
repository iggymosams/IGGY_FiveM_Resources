<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { writable } from "svelte/store";

    export let time: any;
    export let expired = false;

    const timeRemaining = writable("");

    function calculateTimeRemaining(timestamp: number): string {
        const currentTime = Math.floor(Date.now() / 1000);
        const remainingTimeInSeconds = Math.max(0, timestamp - currentTime);

        const hours = Math.floor(remainingTimeInSeconds / 3600);
        const minutes = Math.floor((remainingTimeInSeconds % 3600) / 60);
        const seconds = remainingTimeInSeconds % 60;
        expired = Date.now() / 1000 > time;

        if (hours > 0) {
            return `${hours} hour(s) ${minutes} minute(s)`;
        } else if (minutes > 0) {
            return `${minutes} minute(s) ${seconds} second(s)`;
        } else {
            return `${seconds} second(s)`;
        }
    }

    let intervalId: NodeJS.Timeout;

    onMount(() => {
        timeRemaining.set(calculateTimeRemaining(time));

        intervalId = setInterval(() => {
            timeRemaining.set(calculateTimeRemaining(time));
        }, 1000);
    });

    onDestroy(() => {
        clearInterval(intervalId);
    });
</script>

<div>
    Time Remaining:
    <span class="text-sky-500 font-semibold"> {$timeRemaining} </span>
</div>
