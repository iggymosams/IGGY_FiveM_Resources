<script lang="ts">
    import { fade } from "svelte/transition";
    import { debugData } from "../utils/debugData";
    import { fetchNui } from "../utils/fetchNui";
    import { onMount } from "svelte";
    import { useNuiEvent } from "../utils/useNuiEvent";

    let value = "";
    let error = false;
    let editing = false;

    let isVisible = false;

    interface toggleData {
        visible: boolean;
        editValue?: string;
    }
    useNuiEvent<toggleData>("handle", "toggleEdit", (data) => {
        isVisible = data.visible;
        error = false;
        if (data.editValue) {
            value = data.editValue;
            editing = true;
        } else {
            value = "";
            editing = false;
        }
    });

    onMount(() => {
        const keyHandler = (e: KeyboardEvent) => {
            if (isVisible && ["Escape"].includes(e.code)) {
                fetchNui("closeHandleEdit");
                isVisible = false;
            }
        };

        window.addEventListener("keydown", keyHandler);

        return () => window.removeEventListener("keydown", keyHandler);
    });

    debugData([
        {
            app: "handle",
            action: "toggleEdit",
            data: { visible: false, editing: "" },
        },
    ]);
</script>

{#if isVisible}
    <div
        class="w-1/3 rounded-md bg-neutral-900 text-white p-3 flex flex-col gap-2"
    >
        <div>
            <label for="handle">New Handle</label>
            <input
                name="handle"
                class="w-full bg-transparent outline outline-1 focus:outline-blue-500 rounded-md p-2 transition-[outline]"
                bind:value
                maxlength={25}
            />
        </div>
        <div class="flex items-center">
            {#if error}
                <span class="text-red-500" transition:fade={{ duration: 50 }}>
                    That handle is taken
                </span>
            {/if}
            <button
                class="rounded-md p-2 bg-blue-500 ml-auto hover:bg-blue-400"
                on:click={async () => {
                    fetchNui("updateHandle", {
                        value: value,
                        editing: editing,
                    }).then((resp) => {
                        if (!resp.ok) {
                            error = true;
                        }
                    });
                }}
            >
                Submit
            </button>
        </div>
    </div>
{/if}
