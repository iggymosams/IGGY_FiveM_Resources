<script lang="ts">
    import { debugData } from "../utils/debugData";
    import { fetchNui } from "../utils/fetchNui";
    import { useNuiEvent } from "../utils/useNuiEvent";
    import HackButton from "./HackButton.svelte";
    import HackCountdown from "./HackCountdown.svelte";
    import HackKeypad from "./HackKeypad.svelte";

    let visible = false;
    let difficulty = 0;
    let password: number[] = Array(5);

    let selected: number[] = [];
    let active: number;
    let clicked: number[] = [];
    let wrong = false;
    let highlight: number[] = [];
    let green: number[] = [];
    let disabled = true;

    async function onClick(index: number) {
        let expectedList = selected.slice(clicked.length);
        let expectedIndex = expectedList[0];
        if (index !== expectedIndex) {
            wrong = true;
            disabled = true;
            countdown.stopTimer();
            fetchNui("boosting:hackFailed");
            await new Promise((resolve) => setTimeout(resolve, 500));
            reset();
            return;
        }

        clicked = [...clicked, index];

        let date = Date.now();

        if (!highlight.includes(index)) {
            highlight = [...highlight, index];

            setTimeout(() => {
                highlight = highlight.filter((i) => i !== index);
            }, 1000);
        }
        if (clicked.length === selected.length) {
            complete();
        }
    }

    async function complete() {
        disabled = true;
        countdown.stopTimer();
        for (let i = 0; i < 5; i++) {
            green = [...green, i];

            for (let j = 1; j < 5; j++) {
                green = [...green, i + 5 * j];
            }

            password[i] = Math.floor(Math.random() * (9 - 0) + 0);

            await new Promise((resolve) => setTimeout(resolve, 500));
        }
        fetchNui("boosting:hackComplete");
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
    }

    function reset() {
        visible = false;
        disabled = true;
        selected = [];
        active = -1;
        clicked = [];
        wrong = false;
        highlight = [];
        green = [];
        password = Array(5);
    }

    function getRandomIndexPerColumn(gridSize: number): number[] {
        const indices: number[] = [];

        for (let i = 0; i < difficulty; i++) {
            for (let col = 0; col < 5; col++) {
                const randomIndex =
                    col + Math.floor(Math.random() * gridSize) * 5;
                indices.push(randomIndex);
            }
        }
        return indices;
    }

    async function selectButtons() {
        const gridSize = 1;
        selected = getRandomIndexPerColumn(gridSize);

        for (let index = 0; index < selected.length; index++) {
            active = selected[index];
            await new Promise((resolve) =>
                setTimeout(resolve, 1000 / difficulty)
            );
        }
        startCountdown(30 / difficulty);
        active = -1;
        disabled = false;
    }

    let countdownTime: Date;
    let countdown: HackCountdown;

    function startCountdown(time: number) {
        countdownTime = new Date(new Date().getTime() + time * 1000);
        countdown.startTimer(countdownTime);
    }

    async function onTimerComplete() {
        wrong = true;
        disabled = false;
        countdown.stopTimer();
        fetchNui("boosting:hackFailed");
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        return;
    }

    interface HackData {
        open: boolean;
        difficulty: number;
    }
    useNuiEvent<HackData>("hack", "setVisible", async (data) => {
        visible = data.open;
        difficulty = data.difficulty;
        await new Promise((resolve) => setTimeout(resolve, 100));
        selectButtons();
    });

    debugData([
        {
            app: "hack",
            action: "setVisible",
            data: { open: false, difficulty: 2 },
        },
    ]);
</script>

<div class="bg-gray-900 w-9/12 aspect-video rounded-lg flex overflow-hidden">
    <div
        class="h-full w-4/6 grid grid-cols-5 justify-evenly gap-2 items-center justify-items-center p-2"
    >
        {#each Array(25) as _, index (index)}
            <HackButton
                {index}
                {active}
                {onClick}
                {wrong}
                {disabled}
                highlight={highlight.includes(index)}
                green={green.includes(index)}
            />
        {/each}
    </div>
    <div class="h-full w-2/6 p-3 flex flex-col justify-evenly">
        <div class="w-full text-center text-white text-2xl">
            <HackCountdown bind:this={countdown} {onTimerComplete} />
        </div>
        <div class="grid grid-cols-5 gap-3">
            {#each password as value, i (i)}
                <div
                    class="aspect-square outline outline-2 outline-slate-500 flex justify-center items-center text-green-500 text-2xl font-bold"
                >
                    <span>{value === undefined ? "" : value}</span>
                </div>
            {/each}
        </div>
        <div class="grid grid-cols-3 gap-3">
            {#each Array.from({ length: 3 }, (_, i) => i * 3) as group}
                {#each Array.from({ length: 3 }, (_, j) => 7 - group + j) as value (value)}
                    <HackKeypad number={value} />
                {/each}
            {/each}
            <HackKeypad number={0} />
        </div>
    </div>
</div>
