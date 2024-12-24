<script lang="ts">
  import type { Version, Versions } from "$lib/types/Versions";
  import type { Game } from "$lib/types/Game";
  import axios from "axios";
  import { Dropdown, InputSkin, Label } from "@svelte-fui/core";

  //props
  let { selectedGame = $bindable(null) } = $props();

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
      <Dropdown.Item value={item.gameName} data={item} class="bg-transparent"
        >{item.gameName}</Dropdown.Item
      >
    {/each}
  </Dropdown.Menu>
</Dropdown.Root>
