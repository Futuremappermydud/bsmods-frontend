<script lang="ts">
  import {
    InputSkin,
    Dropdown,
    Label,
    Input,
    Divider,
    Menu,
    Button,
    Icon,
  } from "@svelte-fui/core";
  import { FilterFilled } from "@svelte-fui/icons";
  import type { Version, Versions } from "../../../types/Versions";
  import type { Game } from "$lib/types/Game";
  import axios from "axios";

  //props
  let {
    selectedVersion = $bindable(),
    selectedGame = $bindable(),
    search = $bindable(),
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
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/versions`, { withCredentials: false })
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

<div class="left-side flex flex-row gap-4">
  <div class="bg-neutral-background-2 rounded-xl shadow-8 justify-start flex flex-col flex-1 p-2 gap-3">
    <div class="h-8 flex flex-row gap-2">
      <div class="search flex-1">
        <Input size="lg" placeholder="Search mods" bind:value={search} />
      </div>
      <Button class="p-0 aspect-square">
        <Icon>
          <svg class="w-full h-full m-auto">
            <FilterFilled />
          </svg>
        </Icon>
        <Menu.Root>
          <Label size="lg" class="justify-center flex pt-1 pb-1">Sort</Label>
          {#each ["Alphabetical", "Author Alphabetical", "Last Updated"] as method}
            <Divider />
            <Menu.Group>
              <Menu.Item>
                <div>{method} (Ascending)</div>
              </Menu.Item>
              <Menu.Item>
                <div>{method} (Descending)</div>
              </Menu.Item>
            </Menu.Group>
          {/each}
        </Menu.Root>
      </Button>
    </div>
    <br />
    <Dropdown.Root bind:value={selectedGame}>
      <Dropdown.Trigger class="flex justify-center items-center w-full gap-3" let:data>
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
    <Dropdown.Root bind:value={selectedVersion}>
      <Dropdown.Trigger class="flex justify-center items-center w-full gap-3" let:data>
        <Label class="h-[20px] flex-2">Supports:</Label>
        <InputSkin class="flex-1">
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
            <Dropdown.Item value={item.version} data={item} class="bg-transparent"
              >{item.version}</Dropdown.Item
            >
          {/each}
      </div>
      </Dropdown.Menu>
    </Dropdown.Root>
  </div>

  <Divider class="!flex-none" vertical={true} />
</div>

<style>
  .left-side {
    height: fit-content;
    align-content: center;
  }
</style>
