<script lang="ts">
    import { CircleX } from "lucide-svelte";
    import { fade } from "svelte/transition";
    import { fetchNui } from "../../../utils/fetchNui";

    export let open = false;

    let title = "";
    let message = "";
</script>

{#if open}
    <div
        class="absolute top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center"
        transition:fade={{ duration: 150 }}
    >
        <div class="bg-white rounded-md p-3 shadow-md w-1/3">
            <div class="flex">
                <h1 class="text-2xl font-bold mb-4">New State Announcement</h1>
                <button
                    class="ml-auto rounded-full p-2 w-10 h-10 hover:bg-black/15 aspect-square"
                    on:click={() => {
                        open = !open;
                    }}
                >
                    <CircleX />
                </button>
            </div>
            <label for="title">Title</label>

            <input
                class="w-full border-2 rounded-md p-2 mb-2"
                name="title"
                bind:value={title}
            />
            <label for="message">Message</label>
            <textarea
                class="w-full border-2 rounded-md p-2 mb-2"
                name="message"
                bind:value={message}
            />
            <button
                class="p-3 w-full bg-blue-400 rounded-md shadow-md hover:bg-blue-500"
                on:click={() => {
                    if (title !== "" && message !== "") {
                        fetchNui("gov:newStateAnnouncement", {
                            title,
                            message,
                        });
                        open = false;
                    }
                }}
            >
                Submit
            </button>
        </div>
    </div>
{/if}
