<script lang="ts">
    import { fetchNui } from "../../utils/fetchNui";
    import type { Command } from "../../types/types";

    let options: Command[] = [];
    let binds: {
        name: string;
        cmd: Command | undefined;
    }[];

    async function fetchData() {
        try {
            options = await fetchNui("iggy-admin:getOptions");
            binds = await fetchNui("iggy-admin:getBinds");
            options = [...options];
            binds = [...binds];
        } catch (error) {
            options = [
                {
                    id: "noclip",
                    name: "NoClip",
                    type: "CLIENT",
                    event: "iggy-admin:client:toggleNoClip",
                    commandType: "TOGGLE",
                    favourite: false,
                },
                {
                    id: "reviveSelf",
                    name: "Revive Self",
                    type: "SERVER",
                    event: "iggy-admin:server:reviveSelf",
                    commandType: "BUTTON",
                    favourite: false,
                },
            ];
            binds = [
                { name: "Bind 1", cmd: undefined },
                { name: "Bind 2", cmd: undefined },
                { name: "Bind 3", cmd: undefined },
                { name: "Bind 4", cmd: undefined },
                { name: "Bind 5", cmd: undefined },
            ];
        }
    }

    $: fetchData();

    function handleSelectChange(option: Command, event: Event) {
        const selectedValue = (event.target as HTMLSelectElement).value;
        if (selectedValue === "none") {
            let bind = binds.find((b) => b.cmd?.id === option.id);
            if (bind === undefined) return;
            bind.cmd = undefined;
            binds = [...binds];
            fetchNui("iggy-admin:updateBinds", binds);

            return;
        }
        let bind = binds.find((b) => b.name === selectedValue);
        if (bind === undefined) return;

        bind.cmd = option;
        binds = [...binds];
        fetchNui("iggy-admin:updateBinds", binds);
    }
</script>

<div class="w-full h-full flex-auto p-3 overflow-auto text-white">
    {#each options as option}
        <div class="w-full">
            <span>{option.name}</span>
            {#if binds !== undefined}
                <select
                    class="w-full p-2 bg-neutral-700"
                    on:change={(event) => handleSelectChange(option, event)}
                    value={binds.find((b) => b.cmd?.id === option.id)?.name ||
                        "none"}
                >
                    <option value="none">None</option>
                    {#each binds as bind, i}
                        {#if bind.cmd === undefined || option.name === bind.cmd?.name}
                            <option value={bind.name}>{bind.name}</option>
                        {/if}
                    {/each}
                </select>
            {/if}
        </div>
    {/each}
</div>
