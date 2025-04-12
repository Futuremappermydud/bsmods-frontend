<script lang="ts">
  import EditApproval from "$lib/components/ui/approval/EditApproval.svelte";
  import NewModsApproval from "$lib/components/ui/approval/NewModsApproval.svelte";
  import NewVersionsApproval from "$lib/components/ui/approval/NewVersionsApproval.svelte";
  import GamePicker from "$lib/components/ui/filtering/GamePicker.svelte";
  import GameVersionPicker from "$lib/components/ui/filtering/GameVersionPicker.svelte";
  import Tab from "$lib/components/ui/tablist/Tab.svelte";
  import TabList from "$lib/components/ui/tablist/TabList.svelte";
  import type { ApprovalQueues } from "$lib/types/Approval";
  import type { Versions } from "$lib/types/Versions";
    import { sendSubmit } from "$lib/utils/api";
  import { appendURL } from "$lib/utils/url";
  import { Label, Switch, Dialog, Button, Field, Input, FieldMessageInfo, RadioGroup, Radio, Spinner, Accordion, AccordionItem, AccordionHeader, AccordionPanel } from "@svelte-fui/core";
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

  let showModal = $state(false);
  let modalHeader = $state("");
  let modalBody: {
    header: string;
    body: string;
  }[] = $state([]);

  $effect(() => {
    doShit();
  });

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
            if (selectedVersion && selectedVersion.length > 0) {
              if (approvalQueues.modVersions) {
                approvalQueues.modVersions = approvalQueues.modVersions.filter(
                  (modVersion) => modVersion.version.supportedGameVersionIds.includes(allGameVersions.versions.find((version) => version.version === selectedVersion)?.id as number),
                );
              }
            }
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

  let approvalModalDisplay = $state(false); 
  let approvalModalHeader = $state("Placeholder Header");
  let approvalModalBody = $state("Placeholder Body");
  let approvalModalType = $state<`edits` | `mods` | `modVersions`>(
    "mods",
  );
  let approvalModalModName = $state("");
  let approvalModalModId = $state(NaN);
  let approvalReason = $state("");
  let approvalAction = $state("");
  let approvalModalIsLoading = $state(false);
  let approvalModalIsError = $state(false);
  let approvalModalMessage = $state("");

  async function displayApprovalModal(
    type: `edits` | `mods` | `modVersions`,
    header: string,
    body: string,
    modName: string,
    modId: number
  ) {
    approvalModalType = type;
    approvalModalHeader = header;
    approvalModalBody = body;
    approvalModalModName = modName;
    approvalModalModId = modId;
    approvalModalDisplay = true;
  }

  async function doApproval() {
    if (approvalAction == "" || isNaN(approvalModalModId)) return;
    let data = {
      action: approvalAction,
      reason: approvalReason,
    };
    approvalModalIsLoading = true;
    await axios
      .post(
        appendURL(
          `api/approval/${encodeURIComponent(approvalModalType)}/${encodeURIComponent(approvalModalModId)}/approve`,
        ),
        data,
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          approvalModalMessage = response.data.message;
          approvalModalIsError = false;
        } else {
          let message = response.data.message;
          if (message) {
            approvalModalMessage = message;
          } else {
            approvalModalMessage = "An unknown error occurred.";
          }
          approvalModalIsError = true;
        }
      })
      .catch((error) => {
        console.error("An error occurred, contact a developer!");
        console.error(error);
        if (error.response?.data && `message` in error.response.data) {
          approvalModalMessage = error.response.data.message;
        } else {
          approvalModalMessage = "Failed to execute action. Check logs for more information.";
        }
        approvalModalIsError = true;
        return null;
      });
    approvalModalIsLoading = false;
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
      <EditApproval edits={approvalQueues.edits ? approvalQueues.edits : []} {displayModal} {displayApprovalModal} />
    {:else if page == "mods"}
      <NewModsApproval mods={approvalQueues.mods ? approvalQueues.mods : []} {displayModal} {displayApprovalModal} />
    {:else if page == "versions"}
       <NewVersionsApproval
        modVersions={approvalQueues.modVersions
          ? approvalQueues.modVersions
          : []}
        {displayModal}
        {displayApprovalModal}
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

<Dialog.Root bind:open={approvalModalDisplay} type="modal">
  <Dialog.Header>
    {approvalModalHeader}
    <!--<span class="float-right">
      <Button class="border-none p-1 w-4 h-4" on:click={() => (approvalModalDisplay = false)}>
        <svg
          viewBox="0 0 16 16"
          class="aspect-square h-auto text-neutral-400"
        >
          <DismissFilled />
        </svg>
      </Button>
    </span>-->
  </Dialog.Header>

  <Dialog.Body>
    <div class="flex flex-col gap-4">
      <div class="text-sm text-neutral-foreground-4">
        {approvalModalBody}
      </div>
    </div>
    {#if approvalModalIsLoading}
      <div class="flex flex-row justify-center gap-4 pb-4">
        <Spinner />
      </div>
      <div class="flex flex-col gap-4 pb-4">
        <Button disabled={true}>Loading...</Button>
      </div>
    {:else}
    <div class="flex flex-row gap-4 pb-4">
      <div class="flex flex-row justify-center gap-2 p-4">
        <RadioGroup bind:value={approvalAction}>
          <Label>Action</Label>
        {#if approvalModalType == "edits"}
          <Radio value="approve">Approve</Radio>
          <Radio value="deny">Reject</Radio>
        {:else}
          <Radio value="approve">Verify</Radio>
          <Radio value="deny">Unverified</Radio>
          <Radio value="remove">Remove</Radio>
        {/if}
        </RadioGroup>
      </div>
      <div class="flex flex-col justify-center gap-2 p-2">
        <Field>
          <Label>Reason</Label>
          <Input bind:value={approvalReason} />
          <FieldMessageInfo open>This will be shared with the authors of {approvalModalModName} & will be visible on the mod's page.</FieldMessageInfo>
        </Field>
        <div class="flex flex-row justify-center gap-2">
          <Button on:click={() => approvalReason += "Missing dependencies in manifest.json"}>Deps (Menifest)</Button>
          <Button on:click={() => approvalReason += "Missing dependencies on BeatMods"}>Deps (BM)</Button>
          <Button on:click={() => approvalReason += "Zip file is not formatted correctly"}>Bad Zip</Button>
          <Button on:click={() => approvalReason += "Version in manifest.json and BeatMods do not match"}>Mismatched Version</Button>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-4 pb-4">
      <Button disabled={approvalAction == "" && !approvalModalIsError} on:click={doApproval}>Submit</Button>
    </div>
    {#if approvalModalMessage != ""}
      <div class="flex flex-col gap-4 pb-4">
        {#if approvalModalIsError}
          <p class="text-red-500">{approvalModalMessage}</p>
        {:else}
          <p class="text-green-500">{approvalModalMessage}</p>
        {/if}
      </div>
    {/if}
    {/if}
  </Dialog.Body>
</Dialog.Root>