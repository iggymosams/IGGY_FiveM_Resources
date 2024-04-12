<script lang="ts">
    export let data: { [key: string]: string };
    let input1Value = data["input1"] || "Welcome to Ridge Browser";
</script>

<div
    class="w-full h-full flex flex-col items-center justify-center gap-2 bg-neutral-600"
>
    <div contenteditable={false}>{input1Value}</div>

    {JSON.stringify(data)}
</div>
