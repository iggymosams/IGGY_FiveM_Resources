<script lang="ts">
    import { settings } from "../../../store/settingsStore";

    export let wp: string;
</script>

<button
    class={`aspect-video bg-black bg-cover bg-no-repeat rounded-md text-gray-600 ${$settings.wallpaper === wp ? "border-2" : ""}`}
    style={`background-image: url('${wp}');`}
    on:click={() => {
        $settings.wallpaper = wp;
    }}
/>
