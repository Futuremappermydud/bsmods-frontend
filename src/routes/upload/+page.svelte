<script lang="ts">
  import Tab from "$lib/components/ui/tablist/Tab.svelte";
  import TabList from "$lib/components/ui/tablist/TabList.svelte";
  import { Divider, RadioGroup, Radio } from "@svelte-fui/core";

  let value = $state("existing");
</script>

<div class="flex gap-4 flex-col text-center items-center">
  <p class="text-lg font-semibold text-neutral-foreground-4 absolute top-16 left-4">Upload Mod</p>
  <p class="text-3xl mt-16">1. Pick Your Upload Method</p>
  <Divider class="w-72 mt-6"/>
  <TabList disabled={false} layout="horizontal" bind:value>
    <Tab value="existing">Update an <i>existing</i> Mod</Tab>
    <Tab value="new">Create a <i>new</i> Mod</Tab>
  </TabList>
  <RadioGroup name="fav_fruit">
    <Radio value="apple" on:change={(e) => console.log(e)}>Apple</Radio>
    <Radio value="orange" on:change={(e) => console.log(e)}>Orange</Radio>
    <Radio value="banana" on:change={(e) => console.log(e)}>Banana</Radio>
    <Radio value="pear" on:change={(e) => console.log(e)}>Pear</Radio>
  </RadioGroup>
  {#if value == "existing"}
    <p>Existing</p>
  {:else}
    <p>New</p>
  {/if}
  <Divider class="w-72 mt-6"/>
  <div class="h-36 w-full shadow-4 bg-neutral-background-2 rounded-xl">
    <p></p>
  </div>
</div>
