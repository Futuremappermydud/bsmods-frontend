<script lang="ts">
  import axios from "axios";
  import FilterView from "$lib/components/ui/filtering/FilterView.svelte";
  import type { ModData, Mods } from "$lib/types/Mods";
  import { searchModsIndex, createModsIndex } from "$lib/utils/search";
  import ModCardNeo from "$lib/components/ui/mods/ModCardNeo.svelte";
  import * as Pagination from "$lib/components/ui/pagination";
  import {
    ChevronLeftRegular,
    ChevronRightRegular,
    EmojiSadRegular,
  } from "@svelte-fui/icons";
  import { MediaQuery } from "svelte/reactivity";
  import { appendURL } from "$lib/utils/url";

  //state
  let modSearchError = $state(false);
  let modSearchLoading = $state(true);

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
    modSearchLoading = true;

    axios
      .get(
        appendURL(
          `/api/mods?gameName=${selectedGame}&gameVersion=${selectedVersion}&visibility=verified&platform=universalpc`,
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
      });
  }

  // Display
  let searchedMods: ModData[] = $derived.by(() => {
    if (search === "") return allGameMods;
    return searchModsIndex(search);
  });

  let page = $state(1);
  let perPage = $state(20);

  let slicedMods = $derived(
    searchedMods.slice((page - 1) * perPage, (page - 1) * perPage + perPage),
  );

  // Media Queries

  let isDesktop = new MediaQuery("min-width: 900px");
  let isNotInsanelyStupidTiny = new MediaQuery("min-width: 450px");
</script>

<div class="flex gap-4 flex-col" class:!flex-row={isDesktop.current}>
  <FilterView
    bind:search
    bind:selectedGame
    bind:selectedVersion
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
        class="shadow-4 bg-neutral-background-2 flex-2 h-fit p-[7.5px] rounded-xl gap-2 inline"
      >
        <span>
          Your device is too small to effectively display mod icons, update
          times, and other decorative info. Visit their respective mod pages to
          see these.
          <svg class="w-[1.5em] inline" viewBox="0 0 20 20">
            <EmojiSadRegular />
          </svg>
        </span>
      </div>
    {/if}
    {#if searchedMods.length === 0 || !selectedVersion}
      <svg class="w-20 h-20" viewBox="0 0 20 20">
        <EmojiSadRegular />
      </svg>
      <p>No mods found</p>
    {/if}
    {#if selectedVersion}
      {#if modSearchLoading}
        <p>Loading...</p>
      {:else if modSearchError}
        <p>There was an error loading mods</p>
      {:else}
        {#each slicedMods as mod}
          <ModCardNeo
            mod={mod.mod}
            author={mod.latest.author}
            downloads={mod.latest.downloadCount}
            hasVersion={true}
          />
        {/each}
        {#if searchedMods.length > perPage}
          <Pagination.Root
            count={searchedMods.length}
            {perPage}
            let:pages
            let:currentPage
            bind:page
          >
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.PrevButton>
                  <svg class="h-4 w-4">
                    <ChevronLeftRegular class="h-4 w-4" />
                  </svg>
                  <span class="hidden sm:block">Previous</span>
                </Pagination.PrevButton>
              </Pagination.Item>
              {#each pages as page (page.key)}
                {#if page.type === "ellipsis"}
                  <Pagination.Item>
                    <Pagination.Ellipsis />
                  </Pagination.Item>
                {:else}
                  <Pagination.Item>
                    <Pagination.Link
                      {page}
                      isActive={currentPage === page.value}
                    >
                      {page.value}
                    </Pagination.Link>
                  </Pagination.Item>
                {/if}
              {/each}
              <Pagination.Item>
                <Pagination.NextButton>
                  <span class="hidden sm:block">Next</span>
                  <svg class="h-4 w-4">
                    <ChevronRightRegular class="h-4 w-4" />
                  </svg>
                </Pagination.NextButton>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination.Root>
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
