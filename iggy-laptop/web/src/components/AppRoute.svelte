<script lang="ts">
    import type { SvelteComponent } from "svelte";
    import { Route } from "svelte-routing";
    export let component: typeof SvelteComponent;
    export let id: string;
    export let path: string;
</script>

<Route {path}>
    <svelte:component this={component} {id} />
</Route>
