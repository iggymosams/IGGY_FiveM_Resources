<script lang="ts">
    export let disabled: boolean;
    export let active: number;
    export let clicked: boolean;
    export let wrong: boolean;
    export let index: number;
    export let onClick: (index: number) => void;
    export let green: boolean;
    function getButtonColor(
        a: number,
        c: boolean,
        w: boolean,
        i: number,
        g: boolean,
    ) {
        if (g) return "bg-green-500";
        if (c) return "bg-white";
        if (w) return "bg-red-500";
        if (a === i) return "bg-blue-400";
        return "bg-black";
    }
</script>

<div
    class="outline outline-2 outline-offset-4 outline-green-500 aspect-square w-3/4 rounded-full bg-transparent overflow-hidden"
>
    <button
        {disabled}
        class={`w-full h-full rounded-full ${getButtonColor(
            active,
            clicked,
            wrong,
            index,
            green,
        )} hover:${
            clicked ? "bg-slate-300" : "bg-stone-900"
        } active:scale-95 transition-all duration-100 text-blue-400`}
        on:click|preventDefault={() => {
            onClick(index);
        }}
    />
</div>
