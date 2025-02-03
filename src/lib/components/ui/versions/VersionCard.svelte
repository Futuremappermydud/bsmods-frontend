<script lang="ts">
  import type { Mod, ModVersion } from "$lib/types/Mods";
  import { Status } from "$lib/types/Status";
  import { appendURL } from "$lib/utils/url";
  import { Button, Spinner } from "@svelte-fui/core";
  import { ArrowDownloadRegular, WarningRegular } from "@svelte-fui/icons";
  import { numify } from "numify";
    import type { PageData } from "../../../../routes/$types";
    import axios from "axios";



  let { version, mod, isAuthor, isApprover }: { version: ModVersion, mod: Mod, isAuthor:boolean, isApprover:boolean } = $props();

  let denialClicks = $state(0);
  let loadingDenial = $state(false);

  let submitClicks = $state(0);
  let loadingSubmit = $state(false);

  function deny() {
    denialClicks += 1;
    if (denialClicks > 1) {
      loadingDenial = true;
      sendRevoke();
    }
  }

  function submit() {
    submitClicks += 1;
    if (submitClicks > 1) {
      loadingSubmit = true;
      sendSubmit();
    }
  }

  function sendSubmit() {
    axios
      .post(appendURL(`api/modVersions/${version.id}/submit`), {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          if (response.data !== null) {
            window.location.reload();
            loadingSubmit = false;
          }
        } else {
        }
      })
      .catch((error) => {
        console.error("An error occurred, contact a developer!");
        console.error(error);
      });
  }

  function sendRevoke() {
    axios
      .post(
        appendURL(`api/approval/modVersion/${version.id}/revoke`),
        {
          allowDependants: false,
        },
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          if (response.data !== null) {
            window.location.reload();
            loadingDenial = false;
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

<div
  class="relative flex flex-col gap-1 rounded-xl bg-neutral-background-2 p-4 shadow-4"
>
  <div class="flex flex-col gap-2">
    <div class="flex flex-row items-center gap-2">
      <!-- Redundant, yes, but I think in this card format, it looks much better -->
      <p class="flex-1 text-lg font-semibold">{mod.name} v{version.modVersion}</p>

      {#if mod.fileSize/1024/1024 > 50}
        <div class="flex flex-row bg-neutral-background-3 rounded-md p-1 px-1 items-center gap-1 tooltip">
          <svg viewBox="0 0 20 20" class="w-4 text-neutral-foreground-2 md:w-4">
            <WarningRegular />
          </svg>
          <span class="tooltiptext">This is a very large mod!</span>
        </div>
      {/if}

      <div class="flex flex-row bg-neutral-background-3 rounded-md p-1 px-1 items-center gap-1">
        <svg viewBox="0 0 20 20" class="w-4 text-neutral-foreground-2 md:w-4">
          <ArrowDownloadRegular />
        </svg>
        <span class="text-sm text-neutral-foreground-2 md:text-base">
          {numify(version.downloadCount)}
        </span>
      </div>

      <!-- design is my passion - please revisit these colors, theyre fucked  -->
      {#if version.status === Status.Verified}
        <p class="silly-capitalize text-sm bg-green-700 rounded-md p-1">{version.status}</p>
      {:else if version.status === Status.Unverified}
        <p class="silly-capitalize text-sm bg-orange-700 rounded-md p-1">{version.status}</p>
      {:else if version.status === Status.Private}
        <p class="silly-capitalize text-sm bg-blue-700 rounded-md p-1">{version.status}</p>
      {:else if version.status === Status.Removed}
        <p class="silly-capitalize text-sm bg-red-700 rounded-md p-1">{version.status}</p>
      {/if}
    </div>
    <div>
      <p class="font-semibold">Supports:</p>
      <div class="flex flex-row flex-wrap text-center items-center">
      {#each version.supportedGameVersions as supportedGameVersion}
        <p class="text-sm bg-neutral-background-3 rounded-md m-1 p-1">
          {supportedGameVersion.version}
        </p>
      {/each}
      </div>
    </div>
  </div>
  <Button
    class=""
    onclick={() => {
      window.open(appendURL(`cdn/mod/${version.zipHash}.zip`));
    }}>Download</Button>

    {#if version.status === Status.Verified && isApprover}
      {#if loadingSubmit}
      <div class="flex h-fit flex-row items-center justify-center gap-4">
        <Spinner />
        <p>Loading...</p>
      </div>
      {:else}
      <Button onclick={deny} class="text-palette-red-foreground-1">
      <div class="flex flex-row gap-2">
        <div class="h-2 w-2 rounded-circular bg-neutral-foreground-3 opacity-20" class:!opacity-80={denialClicks > 0}></div>
        <div class="h-2 w-2 rounded-circular bg-neutral-foreground-3 opacity-20" class:!opacity-80={denialClicks > 1}></div>
      </div>
      Revoke Verification
    </Button>
  {/if}
    {:else if version.status === Status.Private && (isAuthor || isApprover)}
    <Button onclick={submit} class="text-palette-red-foreground-1">
      <div class="flex flex-row gap-2">
        <div class="h-2 w-2 rounded-circular bg-neutral-foreground-3 opacity-20" class:!opacity-80={submitClicks > 0}></div>
        <div class="h-2 w-2 rounded-circular bg-neutral-foreground-3 opacity-20" class:!opacity-80={submitClicks > 1}></div>
      </div>
      Submit for Verification
    </Button>
    {/if}
</div>
