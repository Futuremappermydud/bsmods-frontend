<script lang="ts">
  import { Dropdown, InputSkin, Label } from "@svelte-fui/core";
  import { Categories } from "$lib/types/Categories";
  import type { z } from "zod";

  let {
    category = $bindable(),
    categoryScheme,
  }: { category: Categories; categoryScheme: z.Schema } = $props();
</script>

<Dropdown.Root bind:value={category}>
  <Dropdown.Trigger
    class="flex justify-center items-center w-full gap-3"
    let:data
  >
    <Label class="h-[20px] flex-2">Category:</Label>
    <InputSkin
      class="flex-1"
      ariaInvalid={data === undefined ||
        !categoryScheme.safeParse(data).success}
    >
      {#if data}
        <span>{data}</span>
      {:else}
        <span>Select a category</span>
      {/if}

      <Dropdown.Arrow />
    </InputSkin>
  </Dropdown.Trigger>

  <Dropdown.Menu>
    <div class="h-[200px] overflow-scroll flex flex-col rounded">
      {#each Object.keys(Categories) as item}
        <Dropdown.Item value={item} data={item} class="bg-transparent"
          >{item}</Dropdown.Item
        >
      {/each}
    </div>
  </Dropdown.Menu>
</Dropdown.Root>
