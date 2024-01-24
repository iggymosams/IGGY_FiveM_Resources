<script lang="ts">
    export let name: string;
    export let img: string;
    export let price: number;
    export let rentVehicle: () => void;
</script>

<div
    class="h-44 w-full rounded-md overflow-hidden outline outline-1 outline-emerald-400"
>
    <div class="h-4/6 bg-gray-600 w-full relative">
        <img
            alt="A picture of the car"
            class="h-full w-full object-cover"
            src={img}
        />
        <span class="absolute bottom-0 text-lg p-3 font-semibold text-white"
            >{name}</span
        >
    </div>
    <div
        class="h-2/6 bg-transparent flex px-3 items-center align-baseline text-white"
    >
        <span class="text-lg font-medium">${price}</span>
        <button
            class="text-center align-baseline ml-auto rounded-full outline outline-1 outline-emerald-400 text-emerald-400 h-min px-2 py-0.5 hover:bg-emerald-400 hover:text-white"
            on:click|preventDefault={rentVehicle}
        >
            Rent
        </button>
    </div>
</div>
