<script lang="ts">
  import axios from "axios";
  import FilterView from "$lib/components/ui/filtering/FilterView.svelte";
  import type { ModData, Mods } from "$lib/types/Mods";
  import { searchModsIndex, createModsIndex } from "$lib/utils/search";
  import ModCardList from "$lib/components/ui/mods/ModCardList.svelte";
  import { EmojiSadRegular } from "@svelte-fui/icons";
  import { MediaQuery } from "svelte/reactivity";
  import { appendURL } from "$lib/utils/url";
  import Pagination from "$lib/components/ui/pagination/pagination.svelte";
  import { Dropdown, InputSkin, Label } from "@svelte-fui/core";
  import { onMount } from "svelte";

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
          `api/mods?gameName=${selectedGame}&gameVersion=${selectedVersion}&status=verified&platform=universalpc`,
        ),
        { withCredentials: false },
      )
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          modSearchError = false;
          if (response.data !== null) {
            let mods = response.data;
            allMods = mods;

            createModsIndex(allMods.mods.map((mod) => mod.mod));
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
    return searchModsIndex(search)
      .map((mod) => allGameMods.find((m) => m.mod.id === mod.id))
      .filter((m) => !!m);
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

  let viewStyle: "grid" | "list" = $state("list");
  onMount(() => {
    let storedViewStyle = localStorage.getItem("modViewStyle");
    if (storedViewStyle === "grid" || storedViewStyle === "list") {
      viewStyle = storedViewStyle as "grid" | "list";
    }
    else {
      viewStyle = "list";
    }
  });

  $effect(() => {
    localStorage.setItem("modViewStyle", viewStyle); // yes this is stupid to put it here, please move it somewhere else if you know where
  });
</script>

<div class="flex flex-col gap-4" class:!flex-row={isDesktop.current}>
  <div class="left-side flex flex-col gap-4">
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
    {#if isNotInsanelyStupidTiny.current}
      <div class="flex flex-col gap-2 items-center justify-between bg-neutral-background-2 p-2 rounded-lg mr-4">
        <Dropdown.Root bind:value={viewStyle}>
          <Dropdown.Trigger class="flex w-full items-center justify-center gap-2" let:value>
            <Label>View:</Label>
					  <InputSkin class="min-w-[192px]">
						  {#if value == "grid"}
                <span>Grid View</span>
              {:else}
                <span>List View</span>
              {/if}
							<Dropdown.Arrow />
						</InputSkin>
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item value="list">List View</Dropdown.Item>
            <Dropdown.Item value="grid">Grid View</Dropdown.Item>
          </Dropdown.Menu>
			  </Dropdown.Root>
      </div>
    {/if}
  </div>
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
        <!-- Mod Cards & Tiles -->
        {#if viewStyle === "list" || !isNotInsanelyStupidTiny.current}
          {#each slicedMods as mod}
            <ModCardList {mod} type="list" />
          {/each}
        {:else}
          <div class="flex flex-row gap-4 flex-wrap justify-evenly">
          {#each slicedMods as mod}
            <ModCardList {mod} type="card" />
          {/each}
          </div>
        {/if}
        <!-- Pagination stuff -->
        {#if searchedMods.length > perPage}
          <Pagination
            totalItems={searchedMods.length}
            pageSize={perPage}
            bind:currentPage={page}
            limit={1}
            onSetPage={(e: number) => {
              page = e;
              window.scrollTo({
                top: 0, // specific id not needed imo since going to the top is fine
                behavior: "smooth",
              });
            }}
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
