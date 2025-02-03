<script lang="ts">
  import { Link } from "@svelte-fui/core";
  import type { Mod, ModAuthor } from "$lib/types/Mods";
  import ModIcon from "./ModIcon.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { appendURL } from "$lib/utils/url";
  import type { Snippet } from "svelte";
    import { DatabaseArrowDownFilled, WarningFilled } from "@svelte-fui/icons";

  let {
    mod,
    author,
    smallCorners = false,
    slot,
  }: {
    mod: Mod;
    author: ModAuthor | ModAuthor[] | undefined;
    smallCorners?: boolean;
    slot?: Snippet;
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
        src={appendURL(`cdn/icon/${mod.iconFileName}`)}
        modUrl="/mods/{mod.id}"
        {smallCorners}
      />
    {/if}
    <div class="grid h-fit gap-2">
      <div class="flex h-fit w-fit flex-1 flex-row gap-1 md:mt-1">
        <a class="text-lg leading-5 md:text-2xl" href="/mods/{mod.id}"
          >{mod.name}</a
        >
        {#if author}
          <span class="text-md mb-0.5 mt-auto h-fit text-neutral-foreground-2"
            >By
            {#if Array.isArray(author)}
              {#each author as singleAuthor}
                <Link
                  class="z-50"
                  as="button"
                  on:click={() => searchProfile(singleAuthor)}
                  inline={true}
                  >{singleAuthor.username}
                </Link>
              {/each}
            {:else}
              <Link
                class="z-50"
                as="button"
                on:click={() => searchProfile(author)}
                inline={true}
                >{author.username}
              </Link>
            {/if}
          </span>
        {/if}
      </div>
      <p class="text-left text-xs text-neutral-foreground-3 md:text-sm">
        {mod.summary}
      </p>
      <div class="flex w-fit flex-row gap-2">
        <svg viewBox="0 0 20 20" class="w-4 text-neutral-foreground-2 md:w-4">
          <DatabaseArrowDownFilled/>
        </svg>
        <span
          class="silly-capitalize text-sm text-neutral-foreground-2 md:text-base"
          >{(mod.fileSize /1024 > 1024 ? `${Math.round(mod.fileSize/1024/1024)}MB` : (`${Math.round(mod.fileSize/1024)}KB` === `NaNKB` ? `0KB` : `${Math.round(mod.fileSize/1024)}KB`))}</span
        >
        {#if mod.fileSize/1024/1024 > 50}
          <span class="text-lg mt-auto h-fit w-fit tooltip">
            <svg viewBox="0 0 30 30" class="w-6 text-neutral-foreground-2 text-yellow-400 md:w-6">
              <WarningFilled />
            </svg>
            <span class="tooltiptext">This is a very large mod!</span>
          </span>
        {/if}
      </div>
    </div>
    {#if slot}
      {@render slot()}
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
