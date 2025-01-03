<script lang="ts">
  import axios from "axios";
  import FilterView from "$lib/components/ui/filtering/FilterView.svelte";
  import type { ModData, Mods } from "$lib/types/Mods";
  import { searchModsIndex, createModsIndex } from "$lib/utils/search";
  import ModCardList from "$lib/components/ui/mods/ModCardList.svelte";
  import { EmojiSadRegular } from "@svelte-fui/icons";
  import { MediaQuery } from "svelte/reactivity";
  import { appendURL } from "$lib/utils/url";
  import Pagination from "$lib/components/ui/pagination/Pagination.svelte";

  //state
  let modSearchError = $state(false);
  let modSearchLoading = $state(false);

  //data

  let allMods: Mods = $state({
    mods: [],
  });
  let allGameMods = $derived.by(() => {
    if (!allMods) return [];
    if (allMods.mods.length === 0) return [];
    return allMods.mods.filter(
      (mod: ModData) => mod.mod.gameName === selectedGame,
    );
  });

  //user-input
  let selectedGame = $state("BeatSaber");
  let selectedVersion = $state(null);
  let search = $state("");

  $effect(() => {
    if (!selectedGame || !selectedVersion) return;
    getMods();
  });

  let modsPromise = $state(getMods());
  async function getMods() {
    if (!selectedGame || !selectedVersion) {
      modSearchLoading = false;
      return;
    }
    modSearchLoading = true;

    axios
      .get(
        appendURL(
          `api/mods?gameName=${selectedGame}&gameVersion=${selectedVersion}&visibility=verified&platform=universalpc`,
        ),
        { withCredentials: false },
      )
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          modSearchError = false;
          if (response.data !== null) {
            let mods = response.data;
            allMods = mods;

            createModsIndex(allMods.mods);
          }
        } else {
          modSearchError = true;
        }
        modSearchLoading = false;
      })
      .catch((error) => {
        console.error("An error occurred, contact a developer!");
        console.error(error);
        modSearchError = true;
        modSearchLoading = false;
      });
  }

  // Display
  let searchedMods: ModData[] = $derived.by(() => {
    if (search === "") return allGameMods;
    return searchModsIndex(search);
  });

  $inspect(searchedMods.length);

  let page = $state(1);
  let perPage = $state(20);

  let slicedMods = $derived(
    searchedMods.slice((page - 1) * perPage, (page - 1) * perPage + perPage),
  );

  // Media Queries

  let isDesktop = new MediaQuery("min-width: 900px");
  let isNotInsanelyStupidTiny = new MediaQuery("min-width: 450px");
</script>

<div class="flex flex-col gap-4" class:!flex-row={isDesktop.current}>
  <FilterView
    bind:search
    bind:selectedGame
    bind:selectedVersion
    required={true}
    hasDivider={isDesktop.current}
    on:change={() => {
      selectedVersion = null;
      modSearchError = false;
      modSearchLoading = false;
    }}
  />
  <div class="right-side mod-list flex-2">
    {#if !isNotInsanelyStupidTiny.current}
      <div
        class="flex-2 inline h-fit gap-2 rounded-xl bg-neutral-background-2 p-[7.5px] shadow-4"
      >
        <span>
          Your device is too small to effectively display mod icons, update
          times, and other decorative info. Visit their respective mod pages to
          see these.
          <svg class="inline w-[1.5em]" viewBox="0 0 20 20">
            <EmojiSadRegular />
          </svg>
        </span>
      </div>
    {/if}
    {#if searchedMods.length === 0 || !selectedVersion}
      <svg class="h-20 w-20" viewBox="0 0 20 20">
        <EmojiSadRegular />
      </svg>
      {#if !modSearchLoading}
        {#if selectedVersion}
          <p>No mods found</p>
        {:else}
          <p>Select a version to see mods</p>
        {/if}
      {/if}
    {/if}
    {#if selectedVersion}
      {#if modSearchLoading}
        <p>Loading...</p>
      {:else if modSearchError}
        <p>There was an error loading mods</p>
      {:else}
        {#each slicedMods as mod}
          <ModCardList
            mod={mod.mod}
            author={mod.latest.author}
            latestVersion={mod.latest}
            downloads={mod.latest.downloadCount}
            hasVersion={true}
          />
        {/each}
        {#if searchedMods.length > perPage}
          <Pagination
            totalItems={searchedMods.length}
            pageSize={perPage}
            bind:currentPage={page}
            limit={1}
            onSetPage={(e: number) => (page = e)}
          />
        {/if}
      {/if}
    {/if}
  </div>
</div>

<style>
  .right-side {
    display: flex;
    flex: 3;
    flex-direction: column;
  }

  .mod-list {
    gap: 10px;
    display: flex;
    flex-direction: column;
  }
</style>
