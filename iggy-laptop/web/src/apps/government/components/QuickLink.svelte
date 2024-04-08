<script lang="ts">
    export let title: string;
    export let description: string;
</script>

<li class="py-1">
    <button class="text-blue-400 font-semibold hover:underline">
        {title}:
    </button>
    {description}
</li>
