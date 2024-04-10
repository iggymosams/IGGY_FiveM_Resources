<script lang="ts">
    import { CircleX } from "lucide-svelte";
    import { fetchNui } from "../../../utils/fetchNui";
    import { canEdit } from "../../../store/government";

    export let id: number;
    export let title: string;
    export let message: string;
    export let date: string;
</script>

<div class="bg-white shadow-md p-4 rounded-lg flex flex-col w-full mb-2">
    <div class="flex w-full">
        <h3 class="text-2xl font-semibold">{title}</h3>
        {#if $canEdit}
            <button
                class="ml-auto rounded-full p-2 text-xs hover:bg-black/15 aspect-square"
                on:click={() => {
                    fetchNui("gov:deleteAnnouncement", id);
                }}
            >
                <CircleX size={17} />
            </button>
        {/if}
    </div>
    <p>{message}</p>
    <h4 class="ml-auto text-xs">
        {new Date(date).toLocaleString(undefined, {
            timeStyle: "short",
            dateStyle: "medium",
        })}
    </h4>
</div>
