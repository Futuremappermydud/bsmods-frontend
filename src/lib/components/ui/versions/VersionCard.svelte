<script lang="ts">
  import type { Mod, ModVersion } from "$lib/types/Mods";
  import { Status } from "$lib/types/Status";
  import { appendURL } from "$lib/utils/url";
  import { Button } from "@svelte-fui/core";


  let { version, mod }: { version: ModVersion, mod: Mod } = $props();
</script>

<div
  class="relative flex flex-col items-stretch gap-8 rounded-xl bg-neutral-background-2 p-4 shadow-4"
>
  <div class="flex flex-1 flex-col gap-2">
    <div class="flex flex-row items-center gap-2">
      <!-- Redundant, yes, but I think in this card format, it looks much better -->
      <p class="flex-1 text-lg font-semibold">{mod.name} v{version.modVersion}</p>
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
      <div class="flex flex-row flex-wrap text-center items-center justify-center">
      {#each version.supportedGameVersions as supportedGameVersion}
        <p class="text-sm bg-neutral-background-3 rounded-md m-1 p-1">
          {supportedGameVersion.version}
        </p>
      {/each}
      </div>
    </div>
  </div>
  <Button
    class="flex-1"
    onclick={() => {
      window.open(appendURL(`cdn/mod/${version.zipHash}.zip`));
    }}>Download</Button
  >
  <div class=""></div>
</div>
