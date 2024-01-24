<script lang="ts">
    export let selected: string;

    function updateSelected(newSelected: string) {
        selected = newSelected;
    }
</script>

<button
    class={`h-full flex-auto ${
        selected === "ALL" ? "bg-neutral-300" : "bg-rose-600"
    } ${selected === "ALL" ? "hover:bg-neutral-400" : "hover:bg-rose-700"}`}
    on:click|preventDefault={() => updateSelected("ALL")}
>
    ALL
</button>
<button
    class={`h-full flex-auto ${
        selected === "PLAYER" ? "bg-neutral-300" : "bg-rose-600"
    } ${selected === "PLAYER" ? "hover:bg-neutral-400" : "hover:bg-rose-700"}`}
    on:click|preventDefault={() => updateSelected("PLAYER")}
>
    PLAYER
</button>
<button
    class={`h-full flex-auto ${
        selected === "UTILITY" ? "bg-neutral-300" : "bg-rose-600"
    } ${selected === "UTILITY" ? "hover:bg-neutral-400" : "hover:bg-rose-700"}`}
    on:click|preventDefault={() => updateSelected("UTILITY")}
>
    UTILITY
</button>
<button
    class={`h-full flex-auto ${
        selected === "USER" ? "bg-neutral-300" : "bg-rose-600"
    } ${selected === "USER" ? "hover:bg-neutral-400" : "hover:bg-rose-700"}`}
    on:click|preventDefault={() => updateSelected("USER")}
>
    USER
</button>
