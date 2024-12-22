<script lang="ts">
  import type { Version, Versions } from "$lib/types/Versions";
  import type { Game } from "$lib/types/Game";
  import axios from "axios";
  import { Dropdown, InputSkin, Label } from "@svelte-fui/core";

  //props
  let {
    selectedVersion = $bindable(null),
    selectedGame = $bindable(null),
  } = $props();

  //state
  let searchDataError = $state(false);
  let searchDataLoading = $state(true);

  //data
  let allVersions: Versions = $state({
    versions: [],
  });
  let allGames: Game[] = $derived.by(() => {
    if (allVersions.versions.length === 0) return [];
    let games = Array.from(
      new Set(allVersions.versions.map((value) => value.gameName)),
    );
    return games.map((gameName, index) => {
      let game: Game = { id: index, gameName: gameName };
      return game;
    });
  });
  let allGameVersions = $derived.by(() => {
    if (allVersions.versions.length === 0) return [];
    return allVersions.versions.filter(
      (version) => version.gameName === selectedGame,
    );
  });

  let searchDataPromise = getData();
  async function getData() {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/versions`, {
        withCredentials: false,
      })
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          searchDataError = false;
          if (response.data !== null) {
            allVersions = response.data;
          }
        } else {
          searchDataError = true;
        }
        searchDataLoading = false;
      })
      .catch((error) => {
        console.error("An error occurred, contact a developer!");
        console.error(error);
        searchDataError = true;
      });
  }
</script>

<Dropdown.Root bind:value={selectedGame}>
  <Dropdown.Trigger
    class="flex justify-center items-center w-full gap-3"
    let:data
  >
    <Label class="h-[20px] flex-2">Game:</Label>
    <InputSkin class="flex-1">
      {#if data}
        <span>{(data as Game).gameName}</span>
      {:else}
        <span>Select a game</span>
      {/if}

      <Dropdown.Arrow />
    </InputSkin>
  </Dropdown.Trigger>

  <Dropdown.Menu>
    {#each allGames as item (item.id)}
      <Dropdown.Item
        value={item.gameName}
        data={item}
        class="bg-transparent">{item.gameName}</Dropdown.Item
      >
    {/each}
  </Dropdown.Menu>
</Dropdown.Root>
<Dropdown.Root bind:value={selectedVersion}>
  <Dropdown.Trigger
    class="flex justify-center items-center w-full gap-3"
    let:data
  >
    <Label class="h-[20px] flex-2 disabled:text-black">Supports:</Label>
    <InputSkin class="flex-1" disabled={!selectedGame}>
      {#if data}
        <span>{(data as Version).version}</span>
      {:else}
        <span>Select a version</span>
      {/if}

      <Dropdown.Arrow />
    </InputSkin>
  </Dropdown.Trigger>

  <Dropdown.Menu>
    <div class="h-[400px] overflow-scroll flex flex-col rounded">
      {#each allGameVersions.toReversed() as item (item.id)}
        <Dropdown.Item
          value={item.version}
          data={item}
          class="bg-transparent">{item.version}</Dropdown.Item
        >
      {/each}
    </div>
  </Dropdown.Menu>
</Dropdown.Root>

<style lang="postcss">
  :global(.fui-dropdown:has(.fui-input-skin.disabled)) {
    :global(.fui-label) {
      @apply text-neutral-foreground-disabled;
    }
  }
</style>