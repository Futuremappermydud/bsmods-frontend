<script lang="ts">
  import Tab from "$lib/components/ui/tablist/Tab.svelte";
  import TabList from "$lib/components/ui/tablist/TabList.svelte";

  let toUpload = $state("new");
</script>

<div class="flex gap-4 flex-col text-center items-center">
  <p
    class="text-lg font-semibold text-neutral-foreground-4 absolute top-16 left-4"
  >
    Approval
  </p>
  <TabList disabled={false} layout="horizontal" bind:value={toUpload}>
    <Tab value="edit">Edits</Tab>
    <Tab value="new">New Mods</Tab>
  </TabList>
</div>
