<script lang="ts">
    let pClass = "";
    export { pClass as class };
</script>

<div
    {...$$props}
    class={`p-0 m-0 w-full h-full flex relative flex-col ${pClass}`}
>
    <slot />
</div>
