<script lang="ts">
    import { fetchNui } from "../../utils/fetchNui";
    import RentalCard from "./RentalCard.svelte";
    import RentalSortSelect from "./RentalSortSelect.svelte";

    interface vehicleData {
        model: string;
        name: string;
        price: number;
        image: string;
    }

    let vehicles: vehicleData[] = [];
    let filter: string = "";

    let selectOptions = [
        { value: "nameAsc", label: "Name: A to Z" },
        { value: "nameDesc", label: "Name: Z to A" },
        { value: "priceDesc", label: "Price: High to Low" },
        { value: "priceAsc", label: "Price: Low to High" },
    ];

    let selectedSortOption = selectOptions[0];

    function updateSelected(option: { value: string; label: string }) {
        selectedSortOption = option;
    }

    fetchNui("rental:getVehicles")
        .then((data) => {
            vehicles = data;
        })
        .catch(() => {
            vehicles = [
                {
                    model: "adder",
                    name: "Adder",
                    price: 1000,
                    image: "https://static.wikia.nocookie.net/gtawiki/images/9/9e/Adder-GTAV-front.png",
                },
                {
                    model: "adder",
                    name: "ZAdder",
                    price: 10000,
                    image: "https://static.wikia.nocookie.net/gtawiki/images/9/9e/Adder-GTAV-front.png",
                },
                {
                    model: "adder",
                    name: "BAdder",
                    price: 90000,
                    image: "https://static.wikia.nocookie.net/gtawiki/images/9/9e/Adder-GTAV-front.png",
                },
            ];
        });

    function rentVehicle(model: string) {
        fetchNui("rental:rentvehicle", model);
    }

    $: filteredVehicles = filter
        ? vehicles.filter((vehicle) =>
              vehicle.name.toLowerCase().includes(filter.toLowerCase()),
          )
        : vehicles;

    $: sortedVehicles = [...filteredVehicles].sort((a, b) => {
        switch (selectedSortOption.value) {
            case "nameAsc":
                return a.name.localeCompare(b.name);
            case "nameDesc":
                return b.name.localeCompare(a.name);
            case "priceDesc":
                return b.price - a.price;
            case "priceAsc":
                return a.price - b.price;
            default:
                return 0;
        }
    });
</script>

<div class="w-full h-full px-10 text-white">
    <div class="h-full w-full flex">
        <div class="w-1/5 py-4">
            <h1 class="text-center text-2xl font-bold">Rental</h1>
            <input
                class="w-full rounded-sm p-2 outline outline-1 outline-emerald-400 bg-transparent"
                placeholder="Filter Vehicles"
                bind:value={filter}
            />

            <RentalSortSelect
                options={selectOptions}
                selectedOption={selectedSortOption}
                {updateSelected}
            />
        </div>
        <div class="w-4/5 overflow-auto grid grid-cols-3 p-3 gap-3 flex-auto">
            {#each sortedVehicles as vehicle}
                <RentalCard
                    name={vehicle.name}
                    price={vehicle.price}
                    img={vehicle.image}
                    rentVehicle={() => rentVehicle(vehicle.model)}
                />
            {/each}
        </div>
    </div>
</div>
