<script lang="ts">
  import type { Mod, ModVersion } from "$lib/types/Mods";
  import { Status } from "$lib/types/Status";
  import { appendURL } from "$lib/utils/url";
  import { Button } from "@svelte-fui/core";
  import { ArrowDownloadRegular, WarningRegular } from "@svelte-fui/icons";
  import { numify } from "numify";


  let { version, mod }: { version: ModVersion, mod: Mod } = $props();
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

      {#if version.status === Status.Verified}
        <p class="silly-capitalize text-sm bg-green-700 rounded-md p-1">{version.status}</p>
      {:else if version.status === Status.Unverified}
        <p class="silly-capitalize text-sm bg-orange-700 rounded-md p-1">{version.status}</p>
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
    }}>Download</Button
  >
</div>
