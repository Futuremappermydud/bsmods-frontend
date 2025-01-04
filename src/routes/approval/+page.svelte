<script lang="ts">
  import EditsApproval from "$lib/components/ui/approval/EditsApproval.svelte";
  import NewModsApproval from "$lib/components/ui/approval/NewModsApproval.svelte";
  import NewVersionsApproval from "$lib/components/ui/approval/NewVersionsApproval.svelte";
  import GamePicker from "$lib/components/ui/filtering/GamePicker.svelte";
  import Tab from "$lib/components/ui/tablist/Tab.svelte";
  import TabList from "$lib/components/ui/tablist/TabList.svelte";
  import type { NewApproval } from "$lib/types/Approval";
  import { appendURL } from "$lib/utils/url";
  import axios from "axios";

  let page = $state("mods");

  let selectedGame = $state("");

  let modSearchError = $state(false);
  let modSearchLoading = $state(false);

  let newApproval: NewApproval | undefined = $state();

  $effect(() => {
    if (!selectedGame) return;
    getMods();
  });

  async function getMods() {
    modSearchLoading = true;
    axios
      .get(appendURL(`api/approval/new?gameName=${selectedGame}`), {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          modSearchError = false;
          if (response.data !== null) {
            let mods = response.data;
            newApproval = mods;
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
</script>

<div class="flex flex-col items-center gap-4 text-center">
  <p
    class="absolute left-4 top-16 text-lg font-semibold text-neutral-foreground-4"
  >
    Approval
  </p>
  <TabList disabled={false} layout="horizontal" bind:value={page}>
    <Tab value="edits">Edits</Tab>
    <Tab value="mods">New Mods</Tab>
    <Tab value="versions">New Versions</Tab>
  </TabList>

  <div
    class="flex flex-1 flex-col justify-start gap-3 rounded-xl bg-neutral-background-2 p-2 shadow-4"
  >
    <GamePicker bind:selectedGame required={true} />
  </div>

  {#if newApproval}
    {#if page == "edits"}
      <EditsApproval />
    {:else if page == "mods"}
      <NewModsApproval mods={newApproval.mods} />
    {:else if page == "versions"}
      <NewVersionsApproval />
    {/if}
  {/if}
</div>
