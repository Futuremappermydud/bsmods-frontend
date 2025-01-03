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
  import axios from "axios";
  import * as Pagination from "$lib/components/ui/pagination";
  import { appendURL } from "$lib/utils/url";
  import ModCardProfile from "$lib/components/ui/mods/ModCardProfile.svelte";
  import TabList from "$lib/components/ui/tablist/TabList.svelte";
  import Tab from "$lib/components/ui/tablist/Tab.svelte";
  import { Status } from "$lib/types/Status";
  import { zip } from "$lib/utils/enum";
  import { checkUserAnyGame, UserRoles } from "$lib/types/UserRoles";

  let { data }: { data: PageData } = $props();
  let isUser = data.userId === data.info.user.id;
  let userIsApprover = checkUserAnyGame(data.roles, UserRoles.Approver);

  //user-input
  let selectedGame = $state("BeatSaber");
  let selectedVersion = $state(null);
  let search = $state("");
  let modTab = $state("verified");

  let mods: ModData[] = $state([]);

  $effect(() => {
    axios
      .get(
        appendURL(
          `api/user/${data.info.user.id}/mods${isUser ? `?status=${modTab}` : ""}`,
        ),
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          if (response.data !== null) {
            createModsIndex(response.data.mods);

            mods = response.data.mods;
          }
        }
      })
      .catch(() => {});
  });

  let allGameMods = $derived.by(() => {
    if (!mods) return [];
    if (mods.length === 0) return [];
    return mods.filter((mod: ModData) => mod.mod.gameName === selectedGame);
  });

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

<div class="flex flex-col gap-4 md:flex-row">
  <div class="flex flex-col gap-4">
    <div
      class="flex flex-col items-center rounded-xl bg-neutral-background-2 p-4 shadow-16"
    >
      <img
        class="mx-12 my-3 w-stretch max-w-32 rounded-circular"
        src="https://github.com/{data.info.user.username}.png"
        alt="User Avatar"
      />
      <h1 class="text-center text-xl font-semibold">
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
  <div class="flex flex-1 flex-col gap-4">
    {#if isUser || userIsApprover}
      <TabList disabled={false} layout="horizontal" bind:value={modTab}>
        {#each zip(Object.keys(Status), Object.values(Status)).toReversed() as status}
          <Tab value={status.value}>{status.label}</Tab>
        {/each}
      </TabList>
    {/if}
    {#if slicedMods.length === 0}
      <svg class="h-20 w-20" viewBox="0 0 20 20">
        <EmojiSadRegular />
      </svg>
      <p>No mods found</p>
    {/if}
    {#if slicedMods}
      {#each slicedMods as mod}
        <ModCardProfile mod={mod.mod} />
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
  </div>
</div>
