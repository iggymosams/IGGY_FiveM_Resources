<script lang="ts">
    export let selected: string;

    function updateSelected(newSelected: string) {
        selected = newSelected;
    }
</script>

<button
    class={`h-full flex-auto ${
        selected === "COMMANDS" ? "bg-neutral-300" : "bg-rose-600"
    } ${
        selected === "COMMANDS" ? "hover:bg-neutral-400" : "hover:bg-rose-700"
    }`}
    on:click|preventDefault={() => updateSelected("COMMANDS")}
>
    Commands
</button>
<button
    class={`h-full flex-auto ${
        selected === "PLAYERS" ? "bg-neutral-300" : "bg-rose-600"
    } ${selected === "PLAYERS" ? "hover:bg-neutral-400" : "hover:bg-rose-700"}`}
    on:click|preventDefault={() => updateSelected("PLAYERS")}
>
    Players
</button>
<button
    class={`h-full flex-auto ${
        selected === "LOGS" ? "bg-neutral-300" : "bg-rose-600"
    } ${selected === "LOGS" ? "hover:bg-neutral-400" : "hover:bg-rose-700"}`}
    on:click|preventDefault={() => updateSelected("LOGS")}
>
    Logs
</button>
<button
    class={`h-full flex-auto ${
        selected === "OPTIONS" ? "bg-neutral-300" : "bg-rose-600"
    } ${selected === "OPTIONS" ? "hover:bg-neutral-400" : "hover:bg-rose-700"}`}
    on:click|preventDefault={() => updateSelected("OPTIONS")}
>
    Options
</button>
