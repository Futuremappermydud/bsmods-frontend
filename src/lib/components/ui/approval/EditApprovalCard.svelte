<script lang="ts">
  import { object } from "zod";
  import type { SupportedGameVersion } from "$lib/types/Mods";
  import { Button, Link, Spinner, Dialog } from "@svelte-fui/core";
  import ModCardBase from "../mods/ModCardBase.svelte";
  import {
    ArrowDownFilled,
    ArrowDownRegular,
    ArrowRightFilled,
    CheckmarkRegular,
    DismissRegular,
  } from "@svelte-fui/icons";
  import { appendURL } from "$lib/utils/url";
  import axios from "axios";
  import type {
    EditApproval,
    EditQueueDBObject,
    ModApproval,
    ModDBObject,
    ModVersionApproval,
    ModVersionDBObject,
  } from "$lib/types/Approval";
  import MarkdownViewer from "../markdown/MarkdownViewer.svelte";
    import { SemVer } from "semver";

  let {
    edit,
    gameVersions,
  }: {
    edit: EditApproval;
    gameVersions: SupportedGameVersion[];
  } = $props();

  let loading = $state(false);
  let hide = $state(false);

  let approvalClicks = $state(0);
  let denialClicks = $state(0);

  interface Change {
    key: string;
    isMarkdown?: boolean;
    oldValue: any;
    newValue: any;
  }

  let showModal = $state(false);
  let showChangeModal = $state(false);
  let showPreviewModal = $state(false);
  let changeBody: Change[] = $state([]);
  let previewBody: Change | undefined = $state();

  function preview(change: Change) {
    previewBody = change;
    showPreviewModal = true;
    showChangeModal = false;
  }

  function approve() {
    approvalClicks += 1;
    if (approvalClicks > 1) {
      loading = true;
      sendStatus(true);
    }
  }

  function deny() {
    denialClicks += 1;
    if (denialClicks > 1) {
      loading = true;
      sendStatus(false);
    }
  }

  function sendStatus(approved: boolean) {
    axios
      .post(
        appendURL(`api/approval/edit/${edit.edit.id}/approve`),
        {
          accepted: approved,
        },
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          if (response.data !== null) {
            //window.location.reload();
            loading = false;
            hide = true;
          }
        } else {
        }
      })
      .catch((error) => {
        console.error("An error occurred, contact a developer!");
        console.error(error);
      });
  }
</script>

{#snippet approvalButtons()}
    <div class="ml-auto flex flex-row gap-2">
      <div class="flex h-full min-w-20 flex-col gap-[3px]">
        <div
          class="silly-capitalize w-full rounded bg-neutral-background-1 p-1 text-xs"
        >
          {edit.mod.gameName}
        </div>
        <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
          {edit.mod.category}
        </div>
        <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
          <Link href={edit.mod.gitUrl} target="=_blank" rel="no-referrer">GitHub</Link>
        </div>
        <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
          <Link
            on:click={() => {
              changeBody = [];
              if (edit.edit.objectTableName == `mods`) {
                for (let key of Object.keys(
                  edit.edit.object,
                ) as (keyof ModApproval)[]) {
                  let editProp = (edit.edit.object as ModApproval)[
                    key as keyof ModApproval
                  ];
                  let originalProp = (edit.original as ModDBObject)[
                    key as keyof ModDBObject
                  ];
                  if (Array.isArray(editProp) && Array.isArray(originalProp)) {
                    if (
                      !editProp.every(
                        (v) => v === originalProp.find((o) => o === v),
                      ) ||
                      !originalProp.every(
                        (v) => v === editProp.find((o) => o === v),
                      )
                    ) {
                      changeBody.push({
                        key: key,
                        oldValue: originalProp.join(`, `),
                        newValue: editProp.join(`, `),
                      });
                    }
                    continue;
                  }

                  if (editProp != originalProp) {
                    changeBody.push({
                      key: key,
                      isMarkdown: key === `description`,
                      oldValue: originalProp,
                      newValue: editProp,
                    });
                  }
                }
              } else if (edit.edit.objectTableName == `modVersions`) {
                for (let key of Object.keys(
                  edit.edit.object,
                ) as (keyof ModVersionApproval)[]) {
                  let editProp = (edit.edit.object as ModVersionApproval)[
                    key as keyof ModVersionApproval
                  ];
                  let originalProp = (edit.original as ModVersionDBObject)[
                    key as keyof ModVersionDBObject
                  ];
                  if (Array.isArray(editProp) && Array.isArray(originalProp)) { //todo: check the dependency array and convert that to something human readable
                    if (
                      !editProp.every(
                        (v) => v === originalProp.find((o) => o === v),
                      ) ||
                      !originalProp.every(
                        (v) => v === editProp.find((o) => o === v),
                      )
                    ) {
                      changeBody.push({
                        key: key,
                        oldValue: originalProp.join(`, `),
                        newValue: editProp.join(`, `),
                      });
                    }
                    continue;
                  }

                  if (editProp != originalProp) {
                    if (key === `modVersion`) {
                      changeBody.push({
                      key: key,
                      oldValue: (originalProp as SemVer).raw,
                      newValue: (editProp as SemVer).raw,
                    });
                    } else {
                      changeBody.push({
                        key: key,
                        oldValue: originalProp,
                        newValue: editProp,
                      });
                    }
                  }
                }
              }
              showModal = true;
              showChangeModal = true;
              showPreviewModal = false;
            }}>View Changes</Link
          >
        </div>
      </div>
    </div>
  <div class="flex h-full w-14 flex-col gap-2">
    <Button
      class="flex aspect-square h-8 flex-1 flex-grow flex-col gap-0 p-1"
      onclick={approve}
    >
      <div class="flex flex-row gap-2">
        <div
          class="h-2 w-2 rounded-circular bg-neutral-foreground-3 opacity-20"
          class:!opacity-80={approvalClicks > 0}
        ></div>
        <div
          class="h-2 w-2 rounded-circular bg-neutral-foreground-3 opacity-20"
          class:!opacity-80={approvalClicks > 1}
        ></div>
      </div>
      <svg
        viewBox="0 0 20 20"
        class="aspect-square h-auto text-palette-green-foreground-3"
      >
        <CheckmarkRegular />
      </svg>
    </Button>
    <Button
      class="flex aspect-square h-8 flex-1 flex-grow flex-col gap-0 p-1"
      onclick={deny}
    >
      <div class="flex flex-row gap-2">
        <div
          class="h-2 w-2 rounded-circular bg-neutral-foreground-3 opacity-20"
          class:!opacity-80={denialClicks > 0}
        ></div>
        <div
          class="h-2 w-2 rounded-circular bg-neutral-foreground-3 opacity-20"
          class:!opacity-80={denialClicks > 1}
        ></div>
      </div>
      <svg
        viewBox="0 0 19 19"
        class="aspect-square h-auto text-palette-red-foreground-3"
      >
        <DismissRegular />
      </svg>
    </Button>
  </div>
{/snippet}

{#if !hide}
  {#if loading}
    <div
      class="relative h-28 rounded-[17.5px] bg-neutral-background-2 shadow-4"
    >
      <div class="flex h-28 flex-row items-center justify-center gap-4">
        <Spinner />
        <p>Loading...</p>
      </div>
    </div>
  {:else}
    <ModCardBase
      mod={edit.mod}
      author={edit.mod.authors}
      slot={approvalButtons}
    />
  {/if}
{/if}

<Dialog.Root bind:open={showModal} type="modal">
  <Dialog.Header>View Edit</Dialog.Header>

  <Dialog.Body>
    <div class="flex flex-col gap-4 pb-6">
      {#if showChangeModal}
        <div class="flex flex-col gap-2">
          {#each changeBody as change}
            <div class="flex flex-row items-center gap-2">
              <span class="silly-capitalize text-right font-semibold"
                >{change.key}:
              </span>
              <span
                class="max-w-40 overflow-hidden overflow-ellipsis whitespace-nowrap text-right text-red-500"
                >{change.oldValue}</span
              >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
              >
                <ArrowRightFilled />
              </svg>
              <span
                class="max-w-40 overflow-hidden overflow-ellipsis whitespace-nowrap text-right text-green-500"
                >{change.newValue}</span
              >
              {#if change.isMarkdown}
                <Button size="sm" onclick={() => preview(change)}>
                  Show Preview
                </Button>
              {/if}
            </div>
          {/each}
        </div>
      {:else if showPreviewModal && previewBody}
        <Button
          class="w-fit"
          onclick={() => {
            showPreviewModal = false;
            showChangeModal = true;
          }}>Hide Preview</Button
        >
        <div class="flex flex-col justify-center gap-4 align-middle">
          <div
            class="md-container max-h-[30vh] w-full flex-1 overflow-scroll rounded border-2 border-solid border-red-500 p-1 text-left"
          >
            <MarkdownViewer text={previewBody.oldValue} />
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <ArrowDownFilled />
          </svg>
          <div
            class="md-container max-h-[30vh] w-full flex-1 overflow-scroll rounded border-2 border-solid border-green-500 p-1 text-left"
          >
            <MarkdownViewer text={previewBody.newValue} />
          </div>
        </div>
      {/if}
    </div>
  </Dialog.Body>
</Dialog.Root>
