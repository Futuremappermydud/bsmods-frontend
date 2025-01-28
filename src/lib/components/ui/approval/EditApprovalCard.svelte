<script lang="ts">
  import type { Mod, SupportedGameVersion } from "$lib/types/Mods";
  import { Button, Link, Spinner } from "@svelte-fui/core";
  import ModCardBase from "../mods/ModCardBase.svelte";
  import { CheckmarkRegular, DismissRegular } from "@svelte-fui/icons";
  import { appendURL } from "$lib/utils/url";
  import axios from "axios";
  import type { EditApproval, VersionApproval } from "$lib/types/Approval";
  import { object } from "zod";

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

  function approve() {
    approvalClicks += 1;
    if (approvalClicks > 1) {
      loading = true;
      sendStatus("verified");
    }
  }

  function deny() {
    denialClicks += 1;
    if (denialClicks > 1) {
      loading = true;
      sendStatus("removed");
    }
  }

  function sendStatus(status: string) {
    axios
      .post(
        appendURL(`api/approval/edit/${edit.edit.id}/approve`),
        {
          status: status,
        },
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          if (response.data !== null) {
            window.location.reload();
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
  {#if edit.edit.objectTableName == `modVersions` && `modVersion` in edit.edit.object && `modVersion` in edit.original}
    <div class="ml-auto flex flex-row gap-2">
      <div class="flex h-full min-w-20 flex-col gap-[3px]">
        <div
          class="silly-capitalize w-full rounded bg-neutral-background-1 p-1 text-xs"
        >
          {edit.original.modVersion}
        </div>
        <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
          {edit.original.supportedGameVersions
            .map((gameVersion) => {
              let versionString = gameVersions.find(
                (gv) => gv.id === gameVersion,
              )?.version;
              return versionString ? versionString : `${gameVersion}`;
            })
            .join(", ")}
        </div>
        <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
          {edit.original.platform}
        </div>
        <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
          {edit.original.dependencies.length} Deps
        </div>
      </div>
      <div class="flex h-full min-w-20 flex-col gap-[3px]">
        <div
          class="silly-capitalize w-full rounded bg-neutral-background-1 p-1 text-xs"
        >
          {edit.edit.object.modVersion}
        </div>
        <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
          {edit.edit.object.supportedGameVersions
            .map((gameVersion) => {
              let versionString = gameVersions.find(
                (gv) => gv.id === gameVersion,
              )?.version;
              return versionString ? versionString : `${gameVersion}`;
            })
            .join(", ")}
        </div>
        <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
          {edit.edit.object.platform}
        </div>
        <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
          {edit.edit.object.dependencies.length} Deps
        </div>
      </div>
    </div>
  {:else if edit.edit.objectTableName == `mods` && `name` in edit.edit.object && `name` in edit.original}
  <div class="ml-auto flex flex-row gap-2">
    <div class="flex h-full min-w-20 flex-col gap-[3px]">
      <div
        class="silly-capitalize w-full rounded bg-neutral-background-1 p-1 text-xs"
      >
        {edit.original.gameName}
      </div>
      <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
        {edit.original.category}
      </div>
      <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
        <Link href={edit.original.gitUrl}>GitHub</Link>
      </div>
      <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
        <Link>View Original</Link>
      </div>
    </div>
    <div class="flex h-full min-w-20 flex-col gap-[3px]">
      <div
        class="silly-capitalize w-full rounded bg-neutral-background-1 p-1 text-xs"
      >
        {edit.edit.object.gameName}
      </div>
      <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
        {edit.edit.object.category}
      </div>
      <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
        <Link href={edit.edit.object.gitUrl}>GitHub</Link>
      </div>
      <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
        <Link>View Edit</Link>
      </div>
    </div>
  </div>
  {/if}
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
      <div
        class="pointer-events-none absolute bottom-1 left-1 right-1 top-1 float-left rounded-[13.5px] border-2 border-dashed border-neutral-background-6"
      ></div>
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
