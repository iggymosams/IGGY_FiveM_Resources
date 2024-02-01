<script lang="ts">
    import { createEventDispatcher } from "svelte";

    let time = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
    let intervalId: string | number | NodeJS.Timer | undefined;

    let targetDate: Date;
    export let onTimerComplete: () => void;
    let sound: HTMLAudioElement;

    const dispatch = createEventDispatcher();

    function updateCountdown() {
        const currentDate = new Date();
        const timeDifference = targetDate.getTime() - currentDate.getTime();

        if (timeDifference > 0) {
            time = {
                hours: Math.floor(timeDifference / (1000 * 60 * 60)),
                minutes: Math.floor(
                    (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
                ),
                seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
                milliseconds: timeDifference % 1000,
            };
        } else {
            time = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
            onTimerComplete();
            clearInterval(intervalId);
        }
    }

    export function startTimer(countdownTime: Date) {
        targetDate = countdownTime;
        updateCountdown();
        startSound();
        intervalId = setInterval(updateCountdown, 10);
    }

    export function stopTimer() {
        clearInterval(intervalId);
        sound.pause();
    }

    function startSound() {
        console.log(
            "dsjfkhasdfghasdjklfghsfkljgbhs jkzlxcfhneasjuklghxcvklfgh sdfjklxgh jk"
        );
        let file = "../build/sounds/timer.mp3";
        sound = new Audio(file);
        sound.volume = 1;
        sound.loop = true;
        sound.play();
    }

    $: dispatch("timerUpdate", { time });
</script>

<h1>
    {`${String(time.hours).padStart(2, "0")}:${String(time.minutes).padStart(
        2,
        "0"
    )}:${String(time.seconds).padStart(2, "0")}.${String(
        time.milliseconds
    ).padStart(3, "0")}`}
</h1>
