<script lang="ts">
    import AppIcon from "../../../components/AppIcon.svelte";
    import { getApps } from "../../../utils/apps";

    const { apps } = getApps();
</script>

<div class="grid grid-cols-12 gap-2 p-2">
    {#each apps as app}
        <AppIcon {app} />
    {/each}
</div>
