<script lang="ts">
    export let title: string;
    export let navigate: (newPage: string) => void;
    export let page:string
</script>

<button
    on:click={() => {
        navigate(page);
    }}
    class="text-nowrap"
>
    {title}
</button>
