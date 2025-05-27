<script lang="ts">
  import ApprovalDialog from "$lib/components/ui/approval/ApprovalDialog.svelte";
import EditApproval from "$lib/components/ui/approval/EditApproval.svelte";
  import NewModsApproval from "$lib/components/ui/approval/NewModsApproval.svelte";
  import NewVersionsApproval from "$lib/components/ui/approval/NewVersionsApproval.svelte";
  import GamePicker from "$lib/components/ui/filtering/GamePicker.svelte";
  import GameVersionPicker from "$lib/components/ui/filtering/GameVersionPicker.svelte";
  import Tab from "$lib/components/ui/tablist/Tab.svelte";
  import TabList from "$lib/components/ui/tablist/TabList.svelte";
  import type { ApprovalQueues, DisplayApprovalModalFunction } from "$lib/types/Approval";
    import type { StatusHistory } from "$lib/types/Mods";
    import { Status } from "$lib/types/Status";
  import type { Versions } from "$lib/types/Versions";
    import { sendSubmit } from "$lib/utils/api";
  import { appendURL } from "$lib/utils/url";
  import { Label, Switch, Dialog, Button, Field, Input, FieldMessageInfo, RadioGroup, Radio, Spinner, Accordion, AccordionItem, AccordionHeader, AccordionPanel, Tooltip } from "@svelte-fui/core";
    import { DismissFilled } from "@svelte-fui/icons";
  import axios from "axios";

  let page = $state("mods");

  let allGameVersions: Versions = $state({ versions: [] });
  let selectedGame = $state("");
  let selectedVersion = $state("");
  let includeUnverified = $state(false);

  let modSearchError = $state(false);
  let modSearchLoading = $state(false);

  let approvalQueues: ApprovalQueues | undefined = $state({
    mods: undefined,
    modVersions: undefined,
    edits: undefined,
  });

  // svelte-ignore non_reactive_update
    let approvalModal: {
    displayApprovalModal: DisplayApprovalModalFunction
  } & ApprovalDialog;

  let showModal = $state(false);
  let modalHeader = $state("");
  let modalBody: {
    header: string;
    body: string;
  }[] = $state([]);

  $effect(() => {
    doShit();
  });

  function compareObjWithHistory(a: {statusHistory: StatusHistory[], createdAt: string|Date }, b: typeof a) {
      let aStatuses = a.statusHistory.filter(
        (status) =>
          status.status === Status.Pending ||
          status.status === Status.Unverified,
      );
      let bStatuses = b.statusHistory.filter(
        (status) =>
          status.status === Status.Pending ||
          status.status === Status.Unverified,
      );

      let aDate;
      let bDate;
      if (aStatuses.length > 0) {
        aDate = new Date(aStatuses[aStatuses.length - 1].setAt);
      } else {
        aDate = new Date(a.createdAt);
      }
      if (bStatuses.length > 0) {
        bDate = new Date(bStatuses[bStatuses.length - 1].setAt);
      } else {
        bDate = new Date(b.createdAt);
      }

      return aDate.getTime() - bDate.getTime();
  }

  async function doShit() {
    if (!selectedGame) return;
    modSearchLoading = true;
    modSearchError = false;
    if (!approvalQueues) return;
    switch (page) {
      case "edits":
        getApprovalQueue(`edits`).then((data) => {
          if (data && data.edits) {
            approvalQueues.edits = data.edits;
            approvalQueues.edits?.sort((a, b) => {
              const aDate = new Date(a.edit.createdAt);
              const bDate = new Date(b.edit.createdAt);
              return aDate.getTime() - bDate.getTime();
            });
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
            approvalQueues.mods?.sort((a, b) => {
              return compareObjWithHistory(a, b);
            });
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
            if (selectedVersion && selectedVersion.length > 0) {
              if (approvalQueues.modVersions) {
                approvalQueues.modVersions = approvalQueues.modVersions.filter(
                  (modVersion) => modVersion.version.supportedGameVersionIds.includes(allGameVersions.versions.find((version) => version.version === selectedVersion)?.id as number),
                );
              }
            }
            approvalQueues.modVersions?.sort((a, b) => {
              return compareObjWithHistory(a.version, b.version);
            });
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
  }

  async function getApprovalQueue(type: `edits` | `mods` | `modVersions`) {
    return await axios
      .get(
        appendURL(
          `api/approval/${encodeURIComponent(type)}?gameName=${encodeURIComponent(selectedGame)}&includeUnverified=${encodeURIComponent(includeUnverified)}`,
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

  async function displayModal(
    header: string,
    body: { header: string; body: string }[],
  ) {
    modalHeader = header;
    modalBody = body;
    showModal = true;
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
    <GameVersionPicker removeLabel={true}
      bind:allVersions={allGameVersions}
      bind:selectedGame
      bind:selectedVersion
      required={false}
      disabled={page == "edits" || page == "mods"}
      on:change={() => doShit()}
    />
    <Switch
      bind:checked={includeUnverified}
    ><Label>Include Unverified</Label></Switch>
  </div>

  {#if approvalQueues && selectedGame}
    {#if page == "edits"}
      <EditApproval edits={approvalQueues.edits ? approvalQueues.edits : []} {displayModal} displayApprovalModal={approvalModal.displayApprovalModal} />
    {:else if page == "mods"}
      <NewModsApproval mods={approvalQueues.mods ? approvalQueues.mods : []} {displayModal} displayApprovalModal={approvalModal.displayApprovalModal} />
    {:else if page == "versions"}
       <NewVersionsApproval
        modVersions={approvalQueues.modVersions
          ? approvalQueues.modVersions
          : []}
        {displayModal}
        displayApprovalModal={approvalModal.displayApprovalModal}
      />
    {/if}
  {/if}
</div>

<Dialog.Root bind:open={showModal} type="modal">
  <Dialog.Header>{modalHeader}</Dialog.Header>

  <Dialog.Body>
    <div class="flex flex-col gap-4 pb-4">
      {#each modalBody as { header, body }}
        <div class="flex flex-col gap-2">
          <p class="font-semibold">{header}</p>
          <pre
            class="text-wrap rounded-md bg-neutral-background-1 p-2">{body}</pre>
        </div>
      {/each}
    </div>
  </Dialog.Body>
</Dialog.Root>

<ApprovalDialog bind:this={approvalModal} />