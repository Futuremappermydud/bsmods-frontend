<script lang="ts">
  import axios from "axios";
  import FilterView from "../../components/FilterView.svelte";
  import type { ModData, Mods } from "../../types/Mods";
  import { searchModsIndex, createModsIndex } from "$lib/search";
  import ModCardNeo from "../../components/ModCardNeo.svelte";

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
    console.log(allMods);
    return allMods.mods.filter(
      (mod: ModData) => mod.mod.gameName === selectedGame,
    );
  });

  //user-input
  let selectedGame = $state("BeatSaber");
  let selectedVersion = $state("");
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
        `${import.meta.env.VITE_API_BASE_URL}/api/mods?gameName=${selectedGame}&gameVersion=${selectedVersion}&visibility=verified&platform=universalpc`,
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

  //display
  let searchedMods = $derived.by(() => {
    if (search === "") return allGameMods;
    return searchModsIndex(search);
  });
</script>

<div class="flex gap-5 flex-col md:flex-row">
  <FilterView bind:search bind:selectedGame bind:selectedVersion />

  <div class="right-side mod-list flex-2">
    {#if modSearchLoading}
      <p>Loading...</p>
    {:else if modSearchError}
      <p>There was an error loading mods</p>
    {:else}
      {#each searchedMods as mod}
        <ModCardNeo {mod} />
      {/each}
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
    margin: 0 10px;
    gap: 10px;
    display: flex;
    flex-direction: column;
  }
</style>
