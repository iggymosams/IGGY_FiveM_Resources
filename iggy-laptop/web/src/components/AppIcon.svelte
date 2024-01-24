<script lang="ts">
    import Icon from "@iconify/svelte";

    export let name: string;
    export let icon: string;
    export let onClick: (this: Window, ev: MouseEvent) => any;
    export let colour: string;
</script>

<button
    class={`w-24 aspect-square p-3 flex flex-col content-around outline outline-0 rounded-md hover:outline-2 ${colour} bg-slate-800 my-1`}
    on:click|preventDefault={onClick}
>
    <Icon {icon} class="w-full h-1/2" />

    <div class="text-center w-full text-lg my-auto overflow-ellipsis">
        {name}
    </div>
</button>
