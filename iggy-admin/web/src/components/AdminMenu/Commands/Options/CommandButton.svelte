<script lang="ts">
    import type { EventType, Player } from "../../../../types/types";
    import { fetchNui } from "../../../../utils/fetchNui";

    export let text: string;

    export let actionData: {
        event: string;
        data: {
            values: {
                [key: string]: string;
            };
            target: Player;
        };
        type: EventType;
        id: string;
    };

    function onClick() {
        fetchNui("iggy-admin:runCommand", actionData);
    }
</script>

<button
    class="p-2 bg-rose-600 rounded-sm my-2 hover:bg-rose-700 active:bg-rose-800 text-white"
    on:click|preventDefault={onClick}
>
    {text}
</button>
