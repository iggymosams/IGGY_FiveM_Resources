<script lang="ts">
    export let title: string;
    export let message: string;
    export let date: number;
</script>

<div class="bg-white shadow-md p-4 rounded-lg flex flex-col w-full mb-2">
    <h3 class="text-2xl font-semibold">{title}</h3>
    <p>{message}</p>
    <h4 class="ml-auto text-xs">
        {new Date(date).toLocaleString(undefined, {
            timeStyle: "short",
            dateStyle: "medium",
        })}
    </h4>
</div>
