<script lang="ts">
  import { numify } from "numify";
  import type { ModData } from "$lib/types/Mods";
  import { Divider } from "@svelte-fui/core";
  import ModCardBase from "./ModCardBase.svelte";
  import {
    ArrowDownloadRegular,
    ArrowResetRegular,
    ArrowSyncRegular,
    CheckmarkRegular,
  } from "@svelte-fui/icons";
  import { MediaQuery } from "svelte/reactivity";
  import { getRelativeTimeString } from "$lib/utils/time";

  let {
    mod,
  }: {
    mod: ModData;
  } = $props();

  let isNotInsanelyStupidTiny = new MediaQuery("min-width: 450px");
  let isNotStupidTiny = new MediaQuery("min-width: 525px");
</script>

{#snippet rightItems()}
  {#if isNotInsanelyStupidTiny.current && isNotStupidTiny.current}
    <div class="ml-auto flex h-full w-fit flex-row gap-2 pr-2">
      <Divider vertical={true} />
      <div class="mb-auto ml-auto flex h-fit w-max flex-col gap-1">
        <div class="flex w-fit flex-row gap-2">
          <svg viewBox="0 0 20 20" class="w-4 text-neutral-foreground-2 md:w-4">
            <ArrowResetRegular />
          </svg>
          <span class="text-sm text-neutral-foreground-2 md:text-base"
            >{mod.latest.modVersion}</span
          >
        </div>
        <div class="flex w-fit flex-row gap-2">
          <svg viewBox="0 0 20 20" class="w-4 text-neutral-foreground-2 md:w-4">
            <ArrowDownloadRegular />
          </svg>
          <span class="text-sm text-neutral-foreground-2 md:text-base"
            >{numify(mod.latest.downloadCount)}</span
          >
        </div>
        <div class="flex w-fit flex-row gap-2">
          <svg viewBox="0 0 20 20" class="w-4 text-neutral-foreground-2 md:w-4">
            <ArrowSyncRegular />
          </svg>
          <span class="text-xs text-neutral-foreground-2 md:text-base"
            >{getRelativeTimeString(new Date(mod.mod.updatedAt))}</span
          >
        </div>
        <div class="flex w-fit flex-row gap-2">
          <svg viewBox="0 0 20 20" class="w-4 text-neutral-foreground-2 md:w-4">
            <CheckmarkRegular />
          </svg>
          <span
            class="silly-capitalize text-sm text-neutral-foreground-2 md:text-base"
            >{mod.mod.status}</span
          >
        </div>
      </div>
    </div>
  {/if}
{/snippet}

<ModCardBase mod={mod.mod} author={mod.mod.authors} slot={rightItems} />
