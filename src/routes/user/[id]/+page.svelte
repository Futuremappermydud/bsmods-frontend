<script lang="ts">
  import FilterView from "$lib/components/ui/filtering/FilterView.svelte";
  import type { ModData } from "$lib/types/Mods";
  import { createModsIndex, searchModsIndex } from "$lib/utils/search";
  import {
    ChevronLeftRegular,
    ChevronRightRegular,
    EmojiSadRegular,
  } from "@svelte-fui/icons";
  import type { PageData } from "./$types";
  import ModCardNeo from "$lib/components/ui/mods/ModCardNeo.svelte";
  import { onMount } from "svelte";
  import axios from "axios";
  import * as Pagination from "$lib/components/ui/pagination";

  //user-input
  let selectedGame = $state("BeatSaber");
  let selectedVersion = $state(null);
  let search = $state("");

  let { data }: { data: PageData } = $props();

  let mods: ModData[] = $state([]);

  onMount(async () => {
    let privateMods = await axios
      .get(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/${data.info.user.id}/mods?status=private`,
        {
          withCredentials: false,
        },
      )
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          if (response.data !== null) {
            return response.data;
          }
        } else {
        }
      })
      .catch((error) => {});

    mods = [...privateMods.mods];

    let publicMods = await axios
      .get(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/${data.info.user.id}/mods`,
        {
          withCredentials: false,
        },
      )
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          if (response.data !== null) {
            return response.data;
          }
        } else {
        }
      })
      .catch((error) => {});

    mods = [...mods, ...publicMods.mods];
  });

  let allGameMods = $derived.by(() => {
    if (!mods) return [];
    if (mods.length === 0) return [];
    return mods.filter((mod: ModData) => mod.mod.gameName === selectedGame);
  });

  $inspect("hi", allGameMods);

  let searchedMods: ModData[] = $derived.by(() => {
    if (search === "") return allGameMods;
    return searchModsIndex(search);
  });

  let page = $state(1);
  let perPage = $state(20);

  let slicedMods = $derived(
    searchedMods.slice((page - 1) * perPage, (page - 1) * perPage + perPage),
  );
</script>

<div class="flex flex-col md:flex-row gap-4">
  <div class="flex flex-col gap-4">
    <div
      class="flex flex-col items-center shadow-16 bg-neutral-background-2 rounded-xl p-4"
    >
      <img
        class="rounded-circular mx-12 my-3 max-w-32 w-stretch"
        src="https://github.com/{data.info.user.username}.png"
        alt="User Avatar"
      />
      <h1 class="text-xl font-semibold text-center">
        {data.info.user.username}
      </h1>
    </div>
    <FilterView
      bind:selectedGame
      bind:selectedVersion
      bind:search
      hasDivider={false}
      on:change={() => {
        selectedVersion = null;
      }}
    />
  </div>
  <div class="flex-1 flex flex-col gap-4">
    {#if allGameMods.length === 0}
      <svg class="w-20 h-20" viewBox="0 0 20 20">
        <EmojiSadRegular />
      </svg>
      <p>No mods found</p>
    {/if}
    {#if allGameMods}
      {#each allGameMods as mod}
        <ModCardNeo
          mod={mod.mod}
          author={undefined}
          downloads={0}
          hasVersion={!!mod.latest}
        />
      {/each}
      {#if allGameMods.length > perPage}
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
                  <Pagination.Link {page} isActive={currentPage === page.value}>
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
  </div>
</div>
