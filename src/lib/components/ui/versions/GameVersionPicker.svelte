<script lang="ts">
  import type { Version, Versions } from "$lib/types/Versions";
  import axios from "axios";
  import { Dropdown, InputSkin, Label } from "@svelte-fui/core";
  import { EmojiSadRegular } from "@svelte-fui/icons";

  //props
  let { selectedVersion = $bindable(null), selectedGame = $bindable(null) } =
    $props();

  //state
  let searchDataError = $state(false);
  let searchDataLoading = $state(true);

  //data
  let allVersions: Versions = $state({
    versions: [],
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

<Dropdown.Root bind:value={selectedVersion}>
  <Dropdown.Trigger
    class="flex justify-center items-center w-full gap-3"
    let:data
  >
    <Label class="h-[20px] flex-2 disabled:text-black">Supports:</Label>
    <InputSkin class="flex-1" disabled={!selectedGame}>
      {#if selectedVersion}
        <span>{selectedVersion}</span>
      {:else}
        <span>Select a version</span>
      {/if}

      <Dropdown.Arrow />
    </InputSkin>
  </Dropdown.Trigger>

  <Dropdown.Menu>
    <div
      class="max-h-[400px] min-h-[150px] overflow-scroll flex flex-col rounded"
    >
      {#each allGameVersions.toReversed() as item (item.id)}
        <Dropdown.Item value={item.version} data={item} class="bg-transparent"
          >{item.version}</Dropdown.Item
        >
      {/each}

      {#if searchDataLoading}
        <p class="bg-transparent">Loading...</p>
      {/if}
      {#if searchDataError}
        <p class="bg-transparent">Error loading data</p>
      {/if}

      {#if allGameVersions.length === 0 && !searchDataLoading && !searchDataError}
        <div class="flex flex-col items-center m-auto">
          <svg class="w-20 h-20" viewBox="0 0 20 20">
            <EmojiSadRegular />
          </svg>
          <p class="bg-transparent">No versions found</p>
        </div>
      {/if}
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
