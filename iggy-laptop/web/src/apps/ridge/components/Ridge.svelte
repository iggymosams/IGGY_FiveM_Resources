<script lang="ts">
    import AppShell from "../../../components/AppShell.svelte";
    import type { LaptopApp } from "../../../utils/apps";

    export let app: LaptopApp;
</script>

<AppShell {app} class="bg-slate-300">Hello World</AppShell>
