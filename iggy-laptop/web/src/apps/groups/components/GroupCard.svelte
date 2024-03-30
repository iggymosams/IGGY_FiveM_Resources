<script lang="ts">
    import { fetchNui } from "../../../utils/fetchNui";

    export let leader: string;
    export let players: number;
    export let id: number;
</script>

<button
    class="flex justify-between w-full p-4 bg-zinc-700 rounded-md hover:bg-zinc-600 transition-colors"
    on:click={() => fetchNui("groups:requestGroup", id)}
>
    <div class="font-bold">{leader}</div>
    <div>{players + 1}/4</div>
</button>
