<script lang="ts">
  import Icon from "@iconify/svelte";

  export let closeApp: () => void;
</script>

<div class="w-full h-5 bg-gray-500 flex justify-end">
  <button
    class="w-10 hover:bg-red-400 h-full bg-red-500"
    on:click|preventDefault={closeApp}
  >
    <Icon icon="material-symbols:close" class="w-full text-xl" />
  </button>
</div>
