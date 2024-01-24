<script lang="ts">
    import { fetchNui } from "../utils/fetchNui";

    export let name: string;
    export let event: string;

    function onClick() {
        fetchNui("iggy-admin:runSMCommand", {
            event: event,
        });
    }
</script>

<div class="w-full">
    <button
        class={`w-full p-1 bg-white hover:bg-gray-300 active:bg-gray-400 transition-colors duration-150 text-center`}
        on:click|preventDefault={onClick}
    >
        {name}
    </button>
</div>
