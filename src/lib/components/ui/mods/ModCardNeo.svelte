<script lang="ts">
  import { Divider, Link } from "@svelte-fui/core";
  import {
    ArrowDownloadRegular,
    ArrowResetRegular,
    ArrowSyncRegular,
    CheckmarkRegular,
  } from "@svelte-fui/icons";
  import type { Mod, ModAuthor, ModVersion } from "$lib/types/Mods";
  import ModIcon from "./ModIcon.svelte";
  import { getRelativeTimeString } from "$lib/utils/time";
  import { numify } from "numify";
  import { MediaQuery } from "svelte/reactivity";
  import { appendURL } from "$lib/utils/url";

  let {
    mod,
    author,
    latestVersion,
    downloads,
    hasVersion,
    smallCorners = false,
  }: {
    mod: Mod;
    author: ModAuthor | undefined;
    latestVersion: ModVersion | undefined;
    downloads: number;
    hasVersion: boolean | undefined;
    smallCorners?: boolean;
  } = $props();

  function searchProfile(author: ModAuthor) {
    window.open(`/user/${author.id}`, "_self");
  }

  let isNotInsanelyStupidTiny = new MediaQuery("min-width: 450px");
  let isNotStupidTiny = new MediaQuery("min-width: 525px");
  let isNotMobile = new MediaQuery("min-width: 768px");
</script>

{#snippet card()}
  <div
    class="flex-2 pointer-events-auto flex h-28 cursor-pointer gap-2 rounded-[17.5px] bg-neutral-background-2 p-[7.5px] shadow-4 md:h-[120px] md:cursor-default"
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
      <div class="flex h-fit w-fit flex-1 flex-row gap-1 md:mt-1">
        <span class="text-lg leading-5 md:text-2xl">{mod.name}</span>
        {#if author}
          <span class="text-md mb-0.5 mt-auto h-fit text-neutral-foreground-2"
            >By <Link
              class="z-50"
              as="button"
              on:click={() => searchProfile(author)}
              inline={true}>{author.username}</Link
            ></span
          >
        {/if}
      </div>
      <p class="text-left text-xs text-neutral-foreground-3 md:text-sm">
        {mod.summary}
      </p>
    </div>
    {#if hasVersion && isNotInsanelyStupidTiny.current && isNotStupidTiny.current}
      <div class="ml-auto flex h-full w-fit flex-row gap-2 pr-2">
        <Divider vertical={true} />
        <div class="mb-auto ml-auto flex h-fit w-max flex-col gap-1">
          <div class="flex w-fit flex-row gap-2">
            <svg
              viewBox="0 0 20 20"
              class="w-4 text-neutral-foreground-2 md:w-4"
            >
              <ArrowResetRegular />
            </svg>
            <span class="text-sm text-neutral-foreground-2 md:text-base"
              >{latestVersion?.modVersion}</span
            >
          </div>
          <div class="flex w-fit flex-row gap-2">
            <svg
              viewBox="0 0 20 20"
              class="w-4 text-neutral-foreground-2 md:w-4"
            >
              <ArrowDownloadRegular />
            </svg>
            <span class="text-sm text-neutral-foreground-2 md:text-base"
              >{numify(downloads)}</span
            >
          </div>
          <div class="flex w-fit flex-row gap-2">
            <svg
              viewBox="0 0 20 20"
              class="w-4 text-neutral-foreground-2 md:w-4"
            >
              <ArrowSyncRegular />
            </svg>
            <span class="text-xs text-neutral-foreground-2 md:text-base"
              >{getRelativeTimeString(new Date(mod.updatedAt))}</span
            >
          </div>
          <div class="flex w-fit flex-row gap-2">
            <svg
              viewBox="0 0 20 20"
              class="w-4 text-neutral-foreground-2 md:w-4"
            >
              <CheckmarkRegular />
            </svg>
            <span
              class="silly-capitalize text-sm text-neutral-foreground-2 md:text-base"
              >{mod.status}</span
            >
          </div>
        </div>
      </div>
    {/if}
  </div>
{/snippet}

{#if isNotMobile.current}
  {@render card()}
{:else}
  <button
    onclick={() => {
      window.open(`${window.origin}/mods/${mod.id}`, "_self");
    }}
  >
    {@render card()}
  </button>
{/if}

<style>
</style>
