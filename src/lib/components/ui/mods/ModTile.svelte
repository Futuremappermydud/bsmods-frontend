<script lang="ts">
  import { appendURL } from "$lib/utils/url";
  import ModIcon from "$lib/components/ui/mods/ModIcon.svelte";

  import { Button, Link } from "@svelte-fui/core";
  import type { Mod, ModVersion } from "$lib/types/Mods";
    import { numify } from "numify";
    import { getRelativeTimeString } from "$lib/utils/time";
  export let mod: Mod;
  export let version: ModVersion | undefined = undefined
</script>

<!-- w-96 + 1 - yes 3 is odd but 4 looks like too much and 2 is too little -->
<div class="flex flex-col gap-2 w-[26rem] p-3 min-h-32 bg-neutral-background-2 rounded-lg">
  <!-- Top Bar -->
  <div class="flex flex-row">
    <!-- Icon -->
    <span class="w-20 h-20">
      <ModIcon
        src={appendURL(`cdn/icon/${mod.iconFileName}`)}
        modUrl={`/mods/${mod.id}`}
        smallCorners={true}
      />
    </span>
    <div class="flex flex-col justify-center pl-2">
      <!-- Title & Version string -->
      <a class="text-xl text-neutral-foreground-1 text-wrap break-words max-w-80" href={`/mods/${mod.id}`}>
        {mod.name}
      </a>
      <!-- Author String -->
      <div class="flex flex-row gap-2">
        {#if mod.authors && mod.authors.length > 0}
          <span class="text-sm text-neutral-foreground-2">
            By
            {#each mod.authors as author, i}
              <Link
                class="text-neutral-foreground-1"
                as="button"
                on:click={() => (window.location.href = `/user/${author.id}`)}
              >
                {author.username}{i < mod.authors.length - 1 ? ", " : ""}
              </Link>
            {/each}
          </span>
        {/if}
      </div>
      <!-- Version String -->
      {#if version}
        <span class="text-sm text-neutral-foreground-2">
          {version.modVersion} | Updated {getRelativeTimeString(new Date(version.updatedAt))}
        </span>
      {/if}
    </div>
  </div>
  <!-- Summary -->
  <div class="text-sm text-neutral-foreground-3">
    {#if mod.summary}
      <p>{mod.summary}</p>
    {:else}
      <p class="italic">No summary available :(</p>
    {/if}
  </div>
  <!-- Bottom buttons -->
  <div class="flex flex-row gap-2 mt-auto">
    <Button href={`/mods/${mod.id}`} class="flex-1">
      More Info
    </Button>
    <Button
      onclick={() => {
        window.open(appendURL(`cdn/mod/${version?.zipHash}.zip`));
      }}
      class="flex-1"
      disabled={!version}
    >
      Download
    </Button>
  </div>
</div>
