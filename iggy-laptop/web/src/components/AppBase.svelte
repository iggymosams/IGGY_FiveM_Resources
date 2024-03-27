<script lang="ts">
    export let style = "";
    export let props: any | undefined = {};
</script>

<div {...props} class={`p-0 m-0 w-full h-full flex relative flex-col ${style}`}>
    <slot />
</div>
