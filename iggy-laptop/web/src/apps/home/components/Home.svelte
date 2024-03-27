<script lang="ts">
    import AppBase from "../../../components/AppBase.svelte";
    import AppIcon from "../../../components/AppIcon.svelte";
    import { getApps } from "../../../utils/apps";

    const { apps } = getApps();
</script>

<AppBase class="text-white">
    <div class="grid grid-cols-12 gap-2 p-2">
        {#each apps as app}
            <AppIcon {app} />
        {/each}
    </div>
</AppBase>
