<script lang="ts">
    export let number: number;
</script>

<div
    class={`aspect-square outline outline-2 outline-green-500 text-white text-center align-middle items-center text-4xl flex justify-center font-bold ${
        number === 0 ? "col-start-2" : ""
    }`}
>
    <span>{number}</span>
</div>
