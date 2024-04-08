<script lang="ts">
    import { onMount } from "svelte";
    import { announcements, canEdit } from "../../../store/government";
    import Announcement from "./Announcement.svelte";
    import { fetchNui } from "../../../utils/fetchNui";
    import { useNuiEvent } from "../../../utils/useNuiEvent";
    import { type Announcement as AnnouncementType } from "../types";
    import { debugData } from "../../../utils/debugData";
    import StateAnnouncementModal from "./StateAnnouncementModal.svelte";

    let open = false;

    useNuiEvent<AnnouncementType[]>(
        "government",
        "updateAnnouncements",
        (data) => {
            console.log(data);
            announcements.set(data);
        }
    );

    debugData([
        {
            app: "government",
            action: "updateAnnouncements",
            data: [
                {
                    title: "Test",
                    message: "Hello World",
                    date: 0,
                },
            ],
        },
    ]);
</script>

<StateAnnouncementModal bind:open />
<div class="w-full h-full overflow-auto col-span-3">
    <div class="flex items-center">
        <h1 class="font-bold text-3xl pb-3">State Announcements</h1>
        {#if $canEdit}
            <button
                class="ml-auto px-2 py-1 bg-blue-400 rounded-md hover:bg-blue-500"
                on:click={() => {
                    open = !open;
                }}
            >
                Add
            </button>
        {/if}
    </div>
    {#each $announcements as announcement}
        <Announcement
            title={announcement.title}
            message={announcement.message}
            date={announcement.date}
        />
    {/each}
</div>
