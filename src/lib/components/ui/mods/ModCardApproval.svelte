<script lang="ts">
  import type { Mod } from "$lib/types/Mods";
  import { Button, Link, Spinner } from "@svelte-fui/core";
  import ModCardBase from "./ModCardBase.svelte";
  import { CheckmarkNoteFilled, CheckmarkRegular, ChevronCircleRightRegular, DismissRegular, LineDashesRegular, LineFilled } from "@svelte-fui/icons";
  import { appendURL } from "$lib/utils/url";
  import axios from "axios";
  import { ApprovalAction, type DisplayApprovalModalFunction, type DisplayModalFunction } from "$lib/types/Approval";
  

  let {
    mod,
    displayModal,
    displayApprovalModal,
  }: {
    mod: Mod;
    displayModal: DisplayModalFunction;
    displayApprovalModal: DisplayApprovalModalFunction;
  } = $props();

  let loading = $state(false);
  let hide = $state(false);
</script>

{#snippet approvalButtons()}
  <div class="flex flex-row gap-2">
    <div class="flex h-full min-w-20 flex-col gap-[3px]">
      <div
        class="silly-capitalize w-full rounded bg-neutral-background-1 p-1 text-xs"
      >
        {mod.category}
      </div>
      <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
        {mod.status}
      </div>
      <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
        <Link href={mod.gitUrl} target="=_blank" rel="no-referrer">GitHub</Link>
      </div>
      <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
        <Link
          on:click={() => {
            displayModal(
              "Description",
             [{ header: "", body: mod.description }]
            );
          }}>Description</Link
        >
      </div>
    </div>
    <div class="flex h-full w-14 flex-col gap-2">
      <Button appearance="subtle"
        class="flex aspect-square h-8 flex-1 flex-grow flex-row gap-0 p-1"
        onclick={() => {
          displayApprovalModal(
            `mod`,
            `Approve ${mod.name}`,
            "", //`Are you sure you want to approve ${mod.name}?`,
            mod.name,
            mod.id,
            () => {
              hide = true;
            }
          );
        }}
      >
      <svg class="" viewBox="0 0 20 20" >
        <ChevronCircleRightRegular />
      </svg>
      </Button>
    </div>
  </div>
{/snippet}

{#snippet info()}
  Mod ID: {mod.id}
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
    <ModCardBase {mod} latestSize={undefined} author={mod.authors} slot={approvalButtons} info={info}/>
  {/if}
{/if}