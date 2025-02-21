<script lang="ts">
  import type { Mod } from "$lib/types/Mods";
  import { Button, Link, Spinner, Dialog } from "@svelte-fui/core";
  import ModCardBase from "./ModCardBase.svelte";
  import { CheckmarkRegular, DismissRegular } from "@svelte-fui/icons";
  import { appendURL } from "$lib/utils/url";
  import axios from "axios";

  let {
    mod,
  }: {
    mod: Mod;
  } = $props();

  let loading = $state(false);
  let hide = $state(false);

  let approvalClicks = $state(0);
  let denialClicks = $state(0);

  let showModal = $state(false);
  let modalHeader = $state("");
  let modalBody: {
    header: string;
    body: string;
  }[] = $state([]);

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
        appendURL(`api/approval/mod/${mod.id}/approve`),
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
            modalHeader = "Description";
            modalBody = [{ header: "", body: mod.description }];
            showModal = true;
          }}>Description</Link
        >
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
    <ModCardBase {mod} latestSize={undefined} author={mod.authors} slot={approvalButtons} />
  {/if}
{/if}

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
