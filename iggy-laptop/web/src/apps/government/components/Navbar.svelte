<script lang="ts">
    import NavButton from "./NavButton.svelte";
    import SAFlag from "../assets/SA_Flag.png";

    export let minimized: boolean;
    export let navigate: (page: string) => void;
</script>

<div
    class={`bg-blue-400 font-bold text-white flex items-center gap-3  h-[12%] ${minimized ? "px-2 text-lg" : "px-16 text-2xl"}`}
>
    <button
        on:click={() => {
            navigate("HOME");
        }}
        class="flex items-center gap-3 h-full"
    >
        <img src={SAFlag} class="h-3/4 rounded-md" />
        San Andreas Government
    </button>

    <div class="ml-auto flex gap-3 text-lg">
        <NavButton title={"Departments"} {navigate} page="DEPARTMENTS" />
        <NavButton title={"Leadership"} {navigate} page="LEADERSHIP" />
        <NavButton title={"Laws & Regulations"} {navigate} page="LAWS" />
        <NavButton
            title={"Government Facilities"}
            {navigate}
            page="FACILITIES"
        />
    </div>
</div>
