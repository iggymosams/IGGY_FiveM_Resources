<script lang="ts">
    import { settings } from "../store/settingsStore";
</script>

<div
    class="w-full h-full bg-neutral-900 absolute top-0 -z-10 bg-cover bg-no-repeat"
    style={`background-image: url('${$settings.wallpaper}');`}
/>
