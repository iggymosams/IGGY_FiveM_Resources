<script lang="ts">
    export let title: string;
    export let description: string;
    export let page: string;
    export let navigate: (page: string) => void;
</script>

<li class="py-1">
    <button
        class="text-blue-400 font-semibold hover:underline"
        on:click={() => {
            navigate(page);
        }}
    >
        {title}:
    </button>
    {description}
</li>
