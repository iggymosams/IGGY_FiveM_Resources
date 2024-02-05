<script lang="ts">
    import Accordian from "./Accordian.svelte";
    import AccordianButton from "./AccordianButton.svelte";
    import type { Command, CommandGroup, Player } from "../../../types/types";
    import { target } from "../../../store/stores";
    import TopButtonGroup from "./TopButtonGroup.svelte";

    let tab: string = "ALL";
    let filter: string = "";
    export let commands: CommandGroup[] = [];
    let sortedCommands: Command[] = [];
    let targetPlayer: Player;

    target.subscribe((newTarget) => {
        targetPlayer = newTarget;
    });

    function filterCommands(
        cmds: CommandGroup[],
        selectedTab: string,
        filterText: string
    ) {
        let filterd: CommandGroup[] = [];
        cmds.forEach((group) => {
            if (selectedTab === group.tab || selectedTab == "ALL") {
                let obj: CommandGroup = {
                    tab: group.tab,
                    commands: group.commands.filter((cmd) =>
                        cmd.name
                            .toUpperCase()
                            .includes(filterText.toLocaleUpperCase())
                    ),
                };
                filterd.push(obj);
            }
        });
        let favCommands: Command[] = [];
        let nonFavCommands: Command[] = [];
        filterd.forEach((group) => {
            group.commands.forEach((cmd) => {
                if (cmd.favourite) {
                    favCommands.push(cmd);
                } else {
                    nonFavCommands.push(cmd);
                }
            });
        });

        favCommands.sort((a, b) => a.name.localeCompare(b.name));
        nonFavCommands.sort((a, b) => a.name.localeCompare(b.name));
        sortedCommands = favCommands.concat(nonFavCommands);
    }

    function onFavouriteChange(event: { detail: { id: any; favourite: any } }) {
        const { id, favourite } = event.detail;

        for (const group of commands) {
            const command = group.commands.find((cmd) => cmd.id === id);
            if (command) {
                command.favourite = favourite;
            }
        }
        filterCommands(commands, tab, filter);
    }

    $: filterCommands(commands, tab, filter);
</script>

<div class="flex flex-col h-full w-full commands">
    <TopButtonGroup bind:selected={tab} />
    <input
        bind:value={filter}
        class="w-full bg-neutral-600 text-white placeholder:text-neutral-300 p-0.5 focus:outline-0"
        placeholder="Filter Commands..."
    />
    <div class="w-full text-center text-white">
        Current Target: {targetPlayer ? targetPlayer.display : ""}
    </div>
    <div class="h-full w-full flex flex-col flex-grow overflow-auto">
        {#each sortedCommands as command}{#if command.commandType === "COLLAPSE"}
                <Accordian
                    id={command.id}
                    name={command.name}
                    event={command.event}
                    type={command.type}
                    favourite={command.favourite}
                    options={command.options}
                    on:favouriteChange={onFavouriteChange}
                />
            {:else}
                <AccordianButton
                    id={command.id}
                    name={command.name}
                    active={command.active}
                    event={command.event}
                    type={command.type}
                    favourite={command.favourite}
                    cmdType={command.commandType}
                    on:favouriteChange={onFavouriteChange}
                />
            {/if}
        {/each}
    </div>
</div>
