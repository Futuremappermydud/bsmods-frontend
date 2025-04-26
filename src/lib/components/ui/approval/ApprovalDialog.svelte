<script lang="ts">
  import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, Button, Dialog, Field, FieldMessageInfo, Input, Label, Radio, RadioGroup, Spinner } from "@svelte-fui/core";
  import { appendURL } from "$lib/utils/url";
  import axios from "axios";
  import { Status } from "$lib/types/Status";
  import type { Mod } from "$lib/types/Mods";
  import type { DisplayApprovalModalFunction } from "$lib/types/Approval";

  let approvalModalDisplay = $state(false); 
  let approvalModalHeader = $state("Placeholder Header");
  let approvalModalBody = $state("Placeholder Body");
  let approvalModalType = $state<`edit` | `mod` | `modVersion`>(
    "mod",
  );
  let approvalModalMod: Mod | undefined = $state();
  let approvalModalId = $state(NaN);
  let approvalReason = $state("");
  let approvalAction = $state("");
  let approvalModalIsLoading = $state(false);
  let approvalModalIsError = $state(false);
  let approvalModalMessage = $state("");
  let approvalModalIsInteractable = $state(true);
  let lastHideCardFunction = $state(() => {});

  export async function displayApprovalModal(
    type: `edit` | `mod` | `modVersion`,
    header: string,
    body: string,
    mod: Mod,
    id: number,
    hideCard: () => void,
  ) {
    approvalModalType = type;
    approvalModalHeader = header;
    approvalModalBody = body;
    approvalModalMod = mod;
    approvalModalId = id;
    approvalModalDisplay = true;
    lastHideCardFunction = hideCard;
  }

  async function doApproval() {
    if (approvalAction == "" || isNaN(approvalModalId)) return;
    let data = {
      action: approvalAction,
      reason: approvalReason,
    };
    approvalModalIsLoading = true;
    await axios
      .post(
        appendURL(
          `api/approval/${encodeURIComponent(approvalModalType)}/${encodeURIComponent(approvalModalId)}/approve`,
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
          lastHideCardFunction();

          if (approvalModalType == `modVersion`) {
            if (approvalModalMod && approvalModalMod.status !== Status.Verified) {
             displayApprovalModal(
              `mod`,
              `Approve Parent Project?`,
              `${approvalModalMod.name} is not verified. Would you like to approve it as well? If this mod is not verified, any versions of it will not be visible to users. You can find this mod on the "New Mods" page if you do not wish to verify it at this time.`,
              approvalModalMod,
              approvalModalMod.id,
              () => {}, // this card will not be visible since this should only show up on the mod version page.
            ); 
            }
          } else {
            // disable & close card after 3 seconds
            approvalModalIsInteractable = false;
            setTimeout(() => {
              approvalModalDisplay = false;
              approvalModalIsLoading = false;
              approvalModalIsError = false;
              approvalModalMessage = "";
              approvalModalBody = "";
              approvalModalHeader = "";
              approvalModalType = "mod";
              approvalModalMod = undefined;
              approvalModalId = NaN;
              approvalReason = "";
              approvalAction = "";
              approvalModalIsInteractable = true;
            }, 3000);
          }

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
        <Accordion collapsible={true} class="">
          <AccordionItem value="details">
            <AccordionHeader>
              <Button class="px-1 py-0" appearance="subtle">Approval Information</Button>
            </AccordionHeader>
            <AccordionPanel>
              <div class="flex flex-col gap-2">
                <p>There are 4 actions that can be taken for a Project or a Version.</p>
                <ul>
                  <li><b>Verify</b>: Approves the project or version. This will make it visible to all users. This action should be used for mods that fully comply with the approval guidelines. The resulting status will be <code>{Status.Verified}</code>.</li>
                  <li><b>Unverified</b>: Marks the project or version as unverified. Users will still be able to find these mods, but they will not be visible in the main mod list. This action should be used for mods that are either superseded by newer versions, mods that are uploaded for versions no longer supported by approvers, mods that do not fully comply with the approval guidelines, or mods that are not compatible with all other verified mods. Mods in this list should not receive support, but should be preserved for those who might need to run a older version of a mod or game. The resulting status will be <code>{Status.Unverified}</code>.</li>
                  <li><b>Remove</b>: Denies the project or version and marks it available for removal. The version will only be visible to the author of the project & approvers. This action should be used for mods that either do not follow the guidelines at all (e.g. incorrectly formatted zip file, manifest is completely missing) or are not legitimate mods. The resulting status will be <code>{Status.Removed}</code>.</li>
                  <li><b>Restore</b>: Resets the status of the project or version to <code>{Status.Pending}</code>.</li>
                </ul>
                <br>
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
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
          <RadioGroup bind:value={approvalAction} disabled={!approvalModalIsInteractable}>
            <Label>Action</Label>
          {#if approvalModalType == "edit"}
            <Radio value="accept">Approve</Radio>
            <Radio value="deny">Reject</Radio>
          {:else}
            <Radio value="accept">Verify</Radio>
            <Radio value="deny">Unverified</Radio>
            <Radio value="remove">Remove</Radio>
            <Radio value="restore">Restore</Radio>
          {/if}
          </RadioGroup>
        </div>
        <div class="flex flex-col justify-center gap-2 p-2">
          <Field>
            <Label>Reason</Label>
            <Input bind:value={approvalReason} disabled={!approvalModalIsInteractable} />
            <FieldMessageInfo open>This will be shared with the authors of {approvalModalMod?.name} & will be visible on the mod's page.</FieldMessageInfo>
          </Field>
          <div class="flex flex-row justify-center gap-2">
            <Button on:click={() => approvalReason += "Missing dependencies in manifest.json"}>Deps ({Math.random() * 10 % 2 == 1 ? `wo` : ``}manifest)</Button>
            <Button on:click={() => approvalReason += "Missing dependencies on BeatMods"}>Deps (BM)</Button>
            <Button on:click={() => approvalReason += "Zip file is not formatted correctly"}>Bad Zip</Button>
            <Button on:click={() => approvalReason += "Version in manifest.json and BeatMods do not match"}>Mismatched Version</Button>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4 pb-4">
        <Button disabled={(approvalAction == "" && !approvalModalIsError) || !approvalModalIsInteractable} on:click={doApproval}>Submit</Button>
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
  
  <style>
      :global(.fui-accordion-header-button) {
      margin: 0 !important;
      padding: 0 !important; 
      min-height: 0 !important;
      font-weight: 600 !important; /* font-semibold */
    }
  
    :global(.fui-accordion-header-expand-icon) {
      margin: 0 !important;
      padding: 0 !important; 
      width: 0 !important;
      height: 0 !important;
    }
  </style>