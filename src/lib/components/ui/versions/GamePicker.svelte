<script lang="ts">
  import { insertSpaces } from "$lib/utils/string";
  import { SupportedGames } from "$lib/types/SupportedGames";
  import { Dropdown, InputSkin, Label } from "@svelte-fui/core";

  //props
  let { selectedGame = $bindable(null) } = $props();
</script>

<Dropdown.Root bind:value={selectedGame} bind:data={selectedGame} on:change>
  <Dropdown.Trigger
    class="flex justify-center items-center w-full gap-3"
    let:data
  >
    <Label class="h-[20px] flex-2">Game:</Label>
    <InputSkin class="flex-1" ariaInvalid={data === undefined}>
      {#if data}
        <span>{insertSpaces(data as string)}</span>
      {:else}
        <span>Select a game</span>
      {/if}

      <Dropdown.Arrow />
    </InputSkin>
  </Dropdown.Trigger>

  <Dropdown.Menu>
    {#each Object.values(SupportedGames) as item (item)}
      <Dropdown.Item value={item} data={item} class="bg-transparent"
        >{insertSpaces(item)}</Dropdown.Item
      >
    {/each}
  </Dropdown.Menu>
</Dropdown.Root>
