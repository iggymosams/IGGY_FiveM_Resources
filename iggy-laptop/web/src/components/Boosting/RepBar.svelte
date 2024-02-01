<script lang="ts">
    import type { Rep } from "./types";

    export let rep: Rep;
</script>

<h2 class="text-7xl w-full text-center font-black">
    {rep ? rep.level : "Loading"}
</h2>
<div class="w-full h-4 bg-black rounded-full overflow-hidden" id="progressbar">
    <div
        class={`h-full bg-gradient-to-l to-red-500 from-green-400 bg-fixed`}
        style={`width: ${
            rep ? ((rep.xp - rep.min) / (rep.max - rep.min)) * 100 : 0
        }%`}
        id="bar"
    />
</div>
