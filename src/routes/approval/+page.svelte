<script lang="ts">
  import EditApproval from "$lib/components/ui/approval/EditApproval.svelte";
  import NewModsApproval from "$lib/components/ui/approval/NewModsApproval.svelte";
  import NewVersionsApproval from "$lib/components/ui/approval/NewVersionsApproval.svelte";
  import GamePicker from "$lib/components/ui/filtering/GamePicker.svelte";
  import Tab from "$lib/components/ui/tablist/Tab.svelte";
  import TabList from "$lib/components/ui/tablist/TabList.svelte";
  import type { ApprovalQueues } from "$lib/types/Approval";
  import { appendURL } from "$lib/utils/url";
  import axios from "axios";

  let page = $state("mods");

  let selectedGame = $state("");

  let modSearchError = $state(false);
  let modSearchLoading = $state(false);

  let approvalQueues: ApprovalQueues | undefined = $state({
    mods: undefined,
    modVersions: undefined,
    edits: undefined,
  });

  $effect(() => {
    if (!selectedGame) return;
    modSearchLoading = true;
    modSearchError = false;
    switch (page) {
      case "edits":
        getApprovalQueue(`edits`).then((data) => {
          if (data && data.edits) {
            approvalQueues.edits = data.edits;
            console.log(`Loaded ${approvalQueues.edits?.length} edits.`);
          } else {
            modSearchError = true;
          }
        });
        break;
      case "mods":
        getApprovalQueue(`mods`).then((data) => {
          if (data) {
            approvalQueues.mods = data.mods;
            console.log(`Loaded ${approvalQueues.mods?.length} mods.`);
          } else {
            modSearchError = true;
          }
        });
        break;
      case "versions":
        getApprovalQueue(`modVersions`).then((data) => {
          if (data) {
            approvalQueues.modVersions = data.modVersions;
            console.log(
              `Loaded ${approvalQueues.modVersions?.length} versions.`,
            );
          } else {
            modSearchError = true;
          }
        });
        break;
      default:
        console.error("Unknown page selected");
        modSearchError = true;
        break;
    }
    modSearchLoading = false;
  });

  async function getApprovalQueue(type: `edits` | `mods` | `modVersions`) {
    return await axios
      .get(
        appendURL(
          `api/approval/${encodeURIComponent(type)}?gameName=${encodeURIComponent(selectedGame)}`,
        ),
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          modSearchError = false;
          return response.data;
        } else {
          modSearchError = true;
        }
      })
      .catch((error) => {
        console.error("An error occurred, contact a developer!");
        console.error(error);
        modSearchError = true;
        return null;
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

  {#if approvalQueues && selectedGame}
    {#if page == "edits"}
      <EditApproval edits={approvalQueues.edits ? approvalQueues.edits : []} />
    {:else if page == "mods"}
      <NewModsApproval mods={approvalQueues.mods ? approvalQueues.mods : []} />
    {:else if page == "versions"}
      <NewVersionsApproval
        modVersions={approvalQueues.modVersions
          ? approvalQueues.modVersions
          : []}
      />
    {/if}
  {/if}
</div>
