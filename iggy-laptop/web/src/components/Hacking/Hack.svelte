<script lang="ts">
    import { fetchNui } from "../../utils/fetchNui";
    import { debugData } from "../../utils/debugData";
    import { useNuiEvent } from "../../utils/useNuiEvent";
    import HackButton from "./HackButton.svelte";
    import KeypadButton from "./KeypadButton.svelte";
    import Countdown from "./Countdown.svelte";

    type Difficulty = 1 | 2 | 3;

    let visible = false;
    let clicked: number[] = [];
    let wrong = false;
    let selected: number[] = [];
    let green: number[] = [];
    let active: number = -1;
    let disabled = true;
    let expectedIndex = 0;
    let password: number[] = Array(5);
    let difficulty: Difficulty;

    interface HackData {
        open: boolean;
        difficulty: Difficulty;
    }

    debugData([
        {
            app: "hack",
            action: "setVisible",
            data: { open: false, difficulty: 1 },
        },
    ]);

    async function onClick(index: number) {
        if (clicked.includes(index)) return;

        if (
            !selected.includes(index) ||
            selected.indexOf(index) !== expectedIndex
        ) {
            wrong = true;
            disabled = true;
            fetchNui("boosting:hackFailed");
            countdown.stopTimer();
            await new Promise((resolve) => setTimeout(resolve, 500));
            reset();
            return;
        }

        expectedIndex++;
        clicked = [...clicked, index];

        if (clicked.length === selected.length) {
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
    }

    function reset() {
        visible = false;
        clicked = [];
        wrong = false;
        selected = [];
        green = [];
        active = -1;
        disabled = true;
        expectedIndex = 0;
        password = Array(5);
    }

    async function selectButtons() {
        const gridSize = 1;
        selected = getRandomIndexPerColumn(gridSize);

        for (let index = 0; index < selected.length; index++) {
            active = selected[index];
            await new Promise((resolve) =>
                setTimeout(resolve, 1000 / difficulty),
            );
        }
        startCountdown(30 / difficulty);
        active = -1;
        disabled = false;
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

    let countdownTime: Date;
    let countdown: Countdown;

    function startCountdown(time: number) {
        countdownTime = new Date(new Date().getTime() + time * 1000);
        countdown.startTimer(countdownTime);
    }

    async function onTimerComplete() {
        wrong = true;
        disabled = true;
        fetchNui("boosting:hackFailed");
        countdown.stopTimer();
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        return;
    }

    useNuiEvent<HackData>("hack", "setVisible", async (data) => {
        visible = data.open;
        difficulty = data.difficulty;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        selectButtons();
    });
</script>

{#if visible}
    <div class="bg-black w-9/12 aspect-video rounded-lg flex overflow-hidden">
        <div
            class="bg-gray-600 h-full w-4/6 grid grid-cols-5 justify-evenly gap-2 items-center justify-items-center p-2"
        >
            {#each Array(25) as _, index (index)}
                <HackButton
                    {active}
                    clicked={clicked.includes(index)}
                    green={green.includes(index)}
                    {disabled}
                    {index}
                    {wrong}
                    {onClick}
                />
            {/each}
        </div>
        <div class="bg-gray-900 h-full w-2/6 p-3 flex flex-col justify-evenly">
            <div class="w-full text-center text-white text-2xl">
                <Countdown bind:this={countdown} {onTimerComplete} />
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
                        <KeypadButton number={value} />
                    {/each}
                {/each}
                <KeypadButton number={0} />
            </div>
        </div>
    </div>
{/if}
