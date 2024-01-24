<script lang="ts">
    import Accordian from "../components/Accordian.svelte";
    import AccordianButton from "../components/AccordianButton.svelte";
    import type {
        Command,
        CommandGroup,
        OpenData,
        Player,
    } from "../types/types";
    import { target } from "../store/stores";
    import ButtonGroup from "./TopButtonGroup.svelte";

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
        filterText: string,
    ) {
        let filterd: CommandGroup[] = [];
        cmds.forEach((group) => {
            if (selectedTab === group.tab || selectedTab == "ALL") {
                let obj: CommandGroup = {
                    tab: group.tab,
                    commands: group.commands.filter((cmd) =>
                        cmd.name
                            .toUpperCase()
                            .includes(filterText.toLocaleUpperCase()),
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

<div class="w-full h-24 flex flex-col">
    <div class="flex-auto flex text-xl">
        <ButtonGroup bind:selected={tab} />
    </div>
    <input
        class="border-2 border-rose-600 focus:none text-black p-0.5"
        bind:value={filter}
    />
    <span class="w-full text-center">
        Current Target: {targetPlayer ? targetPlayer.display : ""}
    </span>
</div>
<div class="w-full h-1/6 flex-auto bg-white overflow-auto">
    {#each sortedCommands as command}
        {#if command.commandType === "COLLAPSE"}
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
