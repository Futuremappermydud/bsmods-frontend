<script lang="ts">
  import { Dropdown, InputSkin, Label } from "@svelte-fui/core";
  import { Categories } from "$lib/types/Categories";
  import type { z } from "zod";
  import { insertSpaces } from "$lib/utils/string";

  let {
    category = $bindable(),
    categoryScheme,
  }: { category: Categories | undefined; categoryScheme: z.Schema } = $props();

  function zip(a: string[], b: string[]) {
    return a.map((k, i) => {
      return {
        label: k,
        value: b[i],
      };
    });
  }

  interface ZippedValue {
    label: string;
    value: string;
  }
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
        !categoryScheme.safeParse((data as ZippedValue).label).success}
    >
      {#if data}
        <span>{insertSpaces((data as ZippedValue).label)}</span>
      {:else}
        <span>Select a category</span>
      {/if}

      <Dropdown.Arrow />
    </InputSkin>
  </Dropdown.Trigger>

  <Dropdown.Menu>
    <div class="h-[300px] overflow-scroll flex flex-col rounded">
      {#each zip(Object.keys(Categories), Object.values(Categories)) as item}
        <Dropdown.Item value={item.value} data={item} class="bg-transparent"
          >{insertSpaces(item.label)}</Dropdown.Item
        >
      {/each}
    </div>
  </Dropdown.Menu>
</Dropdown.Root>
