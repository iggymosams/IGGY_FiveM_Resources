<script lang="ts">
    import AppShell from "../../../components/AppShell.svelte";
    import type { LaptopApp } from "../../../utils/apps";
    export let app: LaptopApp;
</script>

<AppShell
    {app}
    class="backdrop-blur-xl bg-opacity-50 bg-neutral-700 text-white  "
></AppShell>
