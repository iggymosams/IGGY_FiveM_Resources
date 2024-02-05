<script lang="ts">
    import Icon from "@iconify/svelte";

    export let selected: string;

    function updateSelected(newSelected: string) {
        selected = newSelected;
    }

    const tabs = [
        { id: "COMMANDS", icon: "material-symbols:list" },
        { id: "PLAYERS", icon: "ic:baseline-people" },
        { id: "LOGS", icon: "octicon:log-16" },
        { id: "OPTIONS", icon: "iconamoon:options" },
    ];
</script>

{#each tabs as tab}
    <button
        class={`w-full rounded-md border border-white text-white flex items-center ${
            selected === tab.id ? "bg-rose-700" : "bg-transparent"
        } transition-colors duration-50`}
        on:click|preventDefault={() => updateSelected(tab.id)}
    >
        <Icon icon={tab.icon} class="w-full h-full p-0.5" />
    </button>
{/each}
