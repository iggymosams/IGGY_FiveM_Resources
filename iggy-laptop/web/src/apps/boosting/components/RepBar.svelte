<script lang="ts">
    import type { Rep } from "../types";

    export let rep: Rep;
</script>

<div class="h-1/6 px-10">
    <h2 class="text-7xl w-full text-center font-black">
        {rep ? rep.level : "Loading"}
    </h2>
    <div class="w-full h-4 bg-black rounded-full overflow-hidden">
        <div
            class="h-full bg-gradient-to-r from-red-500 to-green-400 bg-fixed transition-[width]"
            style={`width: ${
                rep ? ((rep.xp - rep.min) / (rep.max - rep.min)) * 100 : 0
            }%`}
        />
    </div>
</div>
