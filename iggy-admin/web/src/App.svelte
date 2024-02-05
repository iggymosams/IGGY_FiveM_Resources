<script lang="ts">
    import { onMount } from "svelte";
    import "./app.css";

    import AdminMenu from "./components/AdminMenu/AdminMenu.svelte";
    import SelectionMenu from "./components/SelectionMenu/SelectionMenu.svelte";
    import ObjectTransformer from "./components/ObjectTransformer.svelte";
    import { fetchNui } from "./utils/fetchNui";
    import { useNuiEvent } from "./utils/useNuiEvent";

    useNuiEvent<string>("copyText", (text) => {
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
    });

    onMount(() => {
        const mouseHandler = (e: MouseEvent) => {
            if (e.button === 2) {
                fetchNui("iggy-admin:toggleFocus");
            }
        };

        window.addEventListener("mousedown", mouseHandler);

        return () => window.removeEventListener("mousedown", mouseHandler);
    });
</script>

<main class="h-full w-full overflow-hidden">
    <AdminMenu />
    <SelectionMenu />
    <ObjectTransformer />
</main>
