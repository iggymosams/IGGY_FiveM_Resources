<script lang="ts">
    import Icon from "@iconify/svelte";

    export let name: string;
    export let icon: string;
    export let onClick: (this: Window, ev: MouseEvent) => any = () => {};
    export let colour: string = "indigo-500";
    console.log(colour);
</script>

<button
    class={`px-3 content-around outline outline-0 rounded-md hover:outline-2 ${colour} hover:bg-black hover:bg-opacity-60`}
    on:click|preventDefault={onClick}
>
    <Icon {icon} class="w-full h-10" />

    <div
        class="text-center w-full text-lg my-auto overflow-hidden overflow-ellipsis"
    >
        {name}
    </div>
</button>
