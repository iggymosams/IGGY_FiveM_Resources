<script lang="ts">
    import "./app.css";
    import Hack from "./components/Hacking/Hack.svelte";
    import Laptop from "./components/Laptop.svelte";
    import { useNuiEvent } from "./utils/useNuiEvent";
    let Restarting = false;

    useNuiEvent("base", "restart", async () => {
        Restarting = true;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        Restarting = false;
    });
</script>

{#if !Restarting}
    <main class="h-full flex items-center justify-center p-20 overflow-hidden">
        <Laptop />
        <Hack />
    </main>
{/if}
