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
  import { MediaQuery } from "svelte/reactivity";
  import { env } from "$env/dynamic/public";
  import { appendURL } from "$lib/utils/url";

  let {
    mod,
    author,
    downloads,
    hasVersion,
    smallCorners = false,
  }: {
    mod: Mod;
    author: ModAuthor | undefined;
    downloads: number;
    hasVersion: boolean | undefined;
    smallCorners?: boolean;
  } = $props();

  function searchProfile(author: ModAuthor) {
    window.open(`/user/${author.id}`, "_self");
  }

  let isNotInsanelyStupidTiny = new MediaQuery("min-width: 450px");
  let isNotStupidTiny = new MediaQuery("min-width: 525px");

  $inspect("bro", isNotStupidTiny.current);
</script>

<div
  class="shadow-4 flex bg-neutral-background-2 flex-2 h-28 md:h-[120px] p-[7.5px] rounded-[17.5px] gap-2"
  class:!rounded-xl={smallCorners || !isNotInsanelyStupidTiny.current}
>
  {#if isNotInsanelyStupidTiny.current}
    <ModIcon
      src={appendURL("cdn/icon/default.png")}
      modUrl="/mods/{mod.id}"
      {smallCorners}
    />
  {/if}
  <div class="grid h-fit gap-2">
    <div class="flex flex-row flex-1 gap-1 h-fit w-fit md:mt-1">
      <span class="text-lg md:text-2xl leading-5">{mod.name}</span>
      {#if author}
        <span class="text-md text-neutral-foreground-2 h-fit mt-auto mb-0.5"
          >By <Link
            as="button"
            on:click={() => searchProfile(author)}
            inline={true}>{author.username}</Link
          ></span
        >
      {/if}
    </div>
    <p class="text-xs md:text-sm text-neutral-foreground-3">{mod.summary}</p>
  </div>
  {#if hasVersion && isNotInsanelyStupidTiny.current && isNotStupidTiny.current}
    <div class="flex flex-row h-full w-fit gap-2 ml-auto">
      <Divider vertical={true} />
      <div class="flex flex-col h-fit mb-auto gap-4 w-max ml-auto">
        <div class="flex flex-row gap-2 w-fit">
          <svg viewBox="0 0 20 20" class="w-4 md:w-6 text-neutral-foreground-2">
            <ArrowDownloadRegular class="w-4 md:w-6" />
          </svg>
          <span class="text-neutral-foreground-2 text-sm md:text-base"
            >{numify(downloads)}</span
          >
        </div>
        <div class="flex flex-row gap-2 w-fit">
          <svg viewBox="0 0 20 20" class="w-4 md:w-6 text-neutral-foreground-2">
            <ArrowSyncRegular class="w-4 md:w-6" />
          </svg>
          <span class="text-neutral-foreground-2 text-xs md:text-base"
            >{getRelativeTimeString(new Date(mod.updatedAt))}</span
          >
        </div>
        <div class="flex flex-row gap-2 w-fit">
          <svg viewBox="0 0 20 20" class="w-4 md:w-6 text-neutral-foreground-2">
            <CheckmarkRegular class="w-4 md:w-6" />
          </svg>
          <span
            class="text-neutral-foreground-2 silly-capitalize text-sm md:text-base"
            >{mod.status}</span
          >
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
</style>
