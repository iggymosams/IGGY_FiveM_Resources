<script lang="ts">
    interface option {
        value: string;
        label: string;
    }
    export let options: option[];

    export let selectedOption: option;
    export let updateSelected: (option: {
        value: string;
        label: string;
    }) => void;
    let isOpen = false;

    function handleOptionClick(option: option) {
        selectedOption = option;
        updateSelected(option);
        isOpen = false;
    }
</script>

<div class="relative inline-block text-left w-full my-2">
    <div>
        <button
            type="button"
            class="inline-flex justify-between w-full p-2 text-sm font-medium outline outline-1 outline-emerald-400 bg-transparent rounded-sm focus:ring-emerald-500"
            id="options-menu"
            aria-haspopup="true"
            aria-expanded="true"
            on:click={() => (isOpen = !isOpen)}
        >
            {selectedOption.label}
        </button>
    </div>

    {#if isOpen}
        <div
            class="text-white absolute right-0 mt-2 border border-emerald-400 rounded-sm shadow-lg origin-top-right ring-1 ring-black ring-opacity-5 w-full"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
        >
            {#each options as option}
                <div
                    class="block px-4 py-2 text-sm hover:bg-emerald-400 hover:text-white"
                    role="menuitem"
                    on:click={() => handleOptionClick(option)}
                >
                    {option.label}
                </div>
            {/each}
        </div>
    {/if}
</div>
