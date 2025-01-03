<script lang="ts">
  import Tab from "$lib/components/ui/tablist/Tab.svelte";
  import TabList from "$lib/components/ui/tablist/TabList.svelte";

  let page = $state("new");
</script>

<div class="flex flex-col items-center gap-4 text-center">
  <p
    class="absolute left-4 top-16 text-lg font-semibold text-neutral-foreground-4"
  >
    Approval
  </p>
  <TabList disabled={false} layout="horizontal" bind:value={page}>
    <Tab value="edit">Edits</Tab>
    <Tab value="new">New Mods</Tab>
  </TabList>

  {#if page == "edit"}
    <p class="mt-16 text-3xl">Edits</p>
  {:else}
    <p class="mt-16 text-3xl">New Mods</p>
  {/if}
</div>
