<script lang="ts">
    import { Users, Lock } from "lucide-svelte";
    import CreateButtons from "./CreateButtons.svelte";
    import { fetchNui } from "../../../utils/fetchNui";
    import { hasVPN } from "../../../store/stores";
    import { groups } from "../../../store/groups";
    import GroupCard from "./GroupCard.svelte";

    function createGroup() {
        fetchNui("groups:createGroup");
    }

    function createPrivateGroup() {
        fetchNui("groups:createPrivateGroup");
    }
</script>

<div class="h-1/3 flex gap-3 mb-3">
    <CreateButtons onClick={createGroup}>
        <Users size={30} class="text-purple-400" />
        Create Group
    </CreateButtons>
    {#if $hasVPN}
        <CreateButtons onClick={createPrivateGroup}>
            <Lock size={30} class="text-purple-400" />
            Create Private Group
        </CreateButtons>
    {/if}
</div>
<div class="pb-3 overflow-auto h-2/3 rounded-md relative">
    <div class="flex flex-col absolute w-full gap-3">
        {#each $groups as group}
            <GroupCard
                leader={group.leader}
                players={group.players.length}
                id={group.id}
            />
        {/each}
    </div>
</div>
