<script lang="ts">
    import AppIcon from "../../../components/AppIcon.svelte";
    import { hasVPN } from "../../../store/stores";
    import { getApps } from "../../../utils/apps";

    const { apps } = getApps();
</script>

<div class="grid gap-2 p-3">
    {#each apps as app}
        {#if (app.requiresVPN && $hasVPN) || !app.requiresVPN}
            <AppIcon {app} />
        {/if}
    {/each}
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, 5rem);
    }
</style>
