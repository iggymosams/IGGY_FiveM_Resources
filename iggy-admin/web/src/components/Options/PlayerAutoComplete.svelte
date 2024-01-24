<script lang="ts">
    import AutoComplete from "simple-svelte-autocomplete";
    import { fetchNui } from "../../utils/fetchNui";
    import { target } from "../../store/stores";
    import type { Player } from "../../types/types";
    let players: Player[] = [];
    let targetPlayer: Player;
    target.subscribe((newTarget) => {
        targetPlayer = newTarget;
    });

    async function getPlayers() {
        try {
            let resp = await fetchNui("iggy-admin:getPlayers");
            players = resp;
        } catch (error) {
            return [
                {
                    display: "[1] iggymosams [steam:1100001123a30f6]",
                    serverId: "1",
                    name: "iggymosams",
                    id: "steam:1100001123a30f6",
                },
                {
                    display: "[2] iggymosams [steam:1100001123a30f6]",
                    serverId: "2",
                    name: "iggymosams",
                    id: "steam:1100001123a30f6",
                },
            ];
        }
    }

    $: getPlayers();
    function updateTarget(newTarget: Player) {
        target.set(newTarget);
    }
</script>

<AutoComplete
    items={players}
    labelFieldName="display"
    valueFieldName="serverId"
    onChange={updateTarget}
    bind:selectedItem={targetPlayer}
    className="w-full"
    placeholder="Target"
/>
