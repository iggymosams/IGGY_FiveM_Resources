<script lang="ts">
    import { onMount } from "svelte";
    import { handle } from "../../../store/stores";
    import { fetchNui } from "../../../utils/fetchNui";
    import { useNuiEvent } from "../../../utils/useNuiEvent";

    let qbit: number;

    useNuiEvent<number>("boosting", "updateQbit", (data) => {
        qbit = data;
    });

    onMount(() => {
        fetchNui("boosting:getQbit");
    });
</script>

<div
    class="w-full text-center text-3xl p-1 flex gap-4 items-center px-10 h-1/6"
>
    <button class="bg-neutral-500 bg-opacity-25 p-2 rounded-md">
        Your Contracts
    </button>
    <button class="bg-neutral-500 bg-opacity-10 p-2 rounded-md">
        Buy Contracts <span class="text-xs">Soon<sup>TM</sup></span>
    </button>
    <span>{qbit} Qbit</span><span class="ml-auto font-bold">{$handle}</span>
</div>
