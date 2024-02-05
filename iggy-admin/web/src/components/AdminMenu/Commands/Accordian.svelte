<script lang="ts">
    import { fade, scale, slide } from "svelte/transition";
    import Icon from "@iconify/svelte";
    import type {
        CommandType,
        EventType,
        Option,
        Player,
    } from "../../../types/types";
    import PlayerAutoComplete from "./Options/PlayerAutoComplete.svelte";
    import CommandButton from "./Options/CommandButton.svelte";
    import { target } from "../../../store/stores";
    import { fetchNui } from "../../../utils/fetchNui";
    import { createEventDispatcher } from "svelte";
    import AsyncAutoComplete from "./Options/AsyncAutoComplete.svelte";
    import AutoComplete from "./Options/AutoComplete.svelte";

    export let open = false;
    export let favourite = false;

    export let id: string;
    export let name: string;
    export let event: string;
    export let type: EventType;
    export let options: Option[] = [];

    let optionValues: { [key: string]: string } = {};

    let targetPlayer: Player;
    target.subscribe((newTarget) => {
        targetPlayer = newTarget;
    });

    function toggle() {
        open = !open;
    }

    function toggleFavourite() {
        favourite = !favourite;
        fetchNui("iggy-admin:toggleFavourite", id);
    }

    const dispatch = createEventDispatcher();

    $: dispatch("favouriteChange", { id, favourite });
</script>

<div class="w-full text-neutral-100">
    <button
        class={`w-full p-1 flex items-center hover:bg-neutral-700 ${
            open ? "bg-neutral-800" : "bg-neutral-900"
        } transition-colors duration-150`}
        on:click|preventDefault={toggle}
    >
        <span class="h-full mx-3">{name}</span>
        <button
            class="ml-auto h-full text-xl text-yellow-500"
            on:click|preventDefault|stopPropagation={toggleFavourite}
        >
            {#if favourite}
                <Icon icon="material-symbols:star" class="w-full h-full" />
            {:else}
                <Icon
                    icon="material-symbols:star-outline"
                    class="w-full h-full"
                />
            {/if}
        </button>
    </button>
    {#if open}
        <div
            class="w-full px-3 py-1 bg-neutral-900"
            transition:slide={{ duration: 150 }}
        >
            {#each options as option}
                {#if option.type === "PLAYER_LIST"}
                    <PlayerAutoComplete />
                {:else if option.type === "INPUT_TEXT"}
                    <input
                        bind:value={optionValues[option.id]}
                        class="w-full py-2 px-3 mb-0.5 bg-neutral-700"
                        placeholder={option.name}
                    />
                {:else if option.type === "INPUT_SELECT"}
                    {#if option.choices}
                        <AutoComplete
                            items={option.choices}
                            bind:selectedItem={optionValues[option.id]}
                            labelFieldName={"label"}
                            placeholder={option.name}
                        />
                    {/if}
                {:else if option.type === "NUMBER"}
                    <input
                        bind:value={optionValues[option.id]}
                        class="w-full py-2 px-3 mb-1 bg-neutral-700"
                        placeholder={option.name}
                        type="number"
                    />
                {:else if option.type === "BUTTON"}
                    {#if option.event && option.eventType}
                        <CommandButton
                            text={option.name}
                            actionData={{
                                event: option.event,
                                data: {
                                    values: optionValues,
                                    target: targetPlayer,
                                },
                                type: option.eventType,
                                id: id,
                            }}
                        />
                    {/if}
                {:else if option.type === "INPUT_ASYNC"}
                    {#if option.asyncCallback}
                        <AsyncAutoComplete
                            callback={option.asyncCallback}
                            bind:selected={optionValues[option.id]}
                            name={option.name}
                            data={optionValues}
                        />
                    {/if}
                {/if}
            {/each}
            <CommandButton
                text={name}
                actionData={{
                    event: event,
                    data: { values: optionValues, target: targetPlayer },
                    type: type,
                    id: id,
                }}
            />
        </div>
    {/if}
</div>
