<script lang="ts">
    export let index: number;
    export let active: number;
    export let onClick: (index: number) => void;
    export let wrong: boolean;
    export let highlight: boolean;
    export let green: boolean;
    export let disabled: boolean;

    function getButtonColour(a: number, w: boolean, h: boolean, g: boolean) {
        if (a === index) return "bg-blue-400";
        if (w) return "bg-red-500";
        if (h) return "bg-white";
        if (g) return "bg-green-500";
        return "bg-black";
    }
</script>

<div
    class="outline outline-2 outline-offset-4 outline-green-500 aspect-square w-3/4 rounded-full bg-transparent overflow-hidden"
>
    <button
        class={`w-full h-full rounded-full  active:scale-95 transition-all duration-200 text-blue-400 ${getButtonColour(active, wrong, highlight, green)}`}
        on:click|preventDefault={() => {
            onClick(index);
        }}
        {disabled}
    />
</div>
