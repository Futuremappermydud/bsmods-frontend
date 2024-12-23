<script lang="ts">
  import { Divider, Link } from "@svelte-fui/core";
  import {
    ArrowDownloadRegular,
    ArrowSyncRegular,
    CheckmarkRegular,
  } from "@svelte-fui/icons";
  import type { Mod, ModAuthor } from "$lib/types/Mods";
  import ModIcon from "./ModIcon.svelte";
  import { getRelativeTimeString } from "$lib/utils/time";
  import { numify } from "numify";

  let {
    mod,
    author,
    downloads,
  }: { mod: Mod; author: ModAuthor; downloads: number } = $props();

  function searchProfile(author: ModAuthor) {
    console.log(`Search Profile button clicked ${author.username}`);
  }
</script>

<div
  class="shadow-4 flex bg-neutral-background-1 flex-2 h-[120px] p-[7.5px] rounded-[17.5px] gap-2"
>
  <ModIcon
    src="{import.meta.env.VITE_API_BASE_URL}/cdn/icon/default.png"
    modUrl="/mods/{mod.id}"
  />
  <div class="grid h-fit gap-2">
    <div class="flex flex-row flex-1 gap-1 h-fit w-fit mt-1">
      <span class="text-2xl leading-5">{mod.name}</span>
      <span class="text-md text-neutral-foreground-2"
        >By <Link
          as="button"
          on:click={() => searchProfile(author)}
          inline={true}>{author.username}</Link
        ></span
      >
    </div>
    <p class="text-neutral-foreground-3">{mod.description}</p>
  </div>
  <div class="flex flex-row h-full w-[115px] gap-2 ml-auto">
    <Divider vertical={true} />
    <div class="flex flex-col h-fit mb-auto gap-4 w-[110px] ml-auto">
      <div class="flex flex-row gap-2 mr-auto w-fit">
        <svg viewBox="0 0 20 20" class="w-6 h-6 text-neutral-foreground-2">
          <ArrowDownloadRegular class="w-6 h-6" />
        </svg>
        <span class="text-neutral-foreground-2">{numify(downloads)}</span>
      </div>
      <div class="flex flex-row gap-2 mr-auto w-fit">
        <svg viewBox="0 0 20 20" class="w-6 h-6 text-neutral-foreground-2">
          <ArrowSyncRegular class="w-6 h-6" />
        </svg>
        <span class="text-neutral-foreground-2"
          >{getRelativeTimeString(new Date(mod.updatedAt))}</span
        >
      </div>
      <div class="flex flex-row gap-2 mr-auto w-fit">
        <svg viewBox="0 0 20 20" class="w-6 h-6 text-neutral-foreground-2">
          <CheckmarkRegular class="w-6 h-6" />
        </svg>
        <span class="text-neutral-foreground-2 silly-capitalize"
          >{mod.status}</span
        >
      </div>
    </div>
  </div>
</div>

<style>
</style>
