<script lang="ts">
    import type { VehicleClass } from "./types";

    export let vehClass: VehicleClass;
    let bg: string;
    switch (vehClass) {
        case "A":
            bg = "from-cyan-500 to-blue-500";
            break;
        case "B":
            bg = "from-violet-500 to-fuchsia-500";
            break;
        case "C":
            bg = "from-yellow-500 to-red-500";
            break;
        default:
            break;
    }
</script>

<div
    class={`rounded-full text-center p-3 h-full flex aspect-square justify-center items-center bg-gradient-to-br ${bg}`}
>
    <span class="h-min font-extrabold text-3xl">{vehClass}</span>
</div>
