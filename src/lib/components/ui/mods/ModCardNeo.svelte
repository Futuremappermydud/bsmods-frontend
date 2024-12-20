<script lang="ts">
  import { Link } from '@svelte-fui/core';
  import { ArrowSyncFilled } from '@svelte-fui/icons';
	import type { ModData } from '$lib/types/Mods';
  import ModIcon from "./ModIcon.svelte";
  import { getRelativeTimeString } from '$lib/utils/time';

  let { mod }: { mod: ModData} = $props();

  function searchProfile(mod: ModData) {
    console.log(`Search Profile button clicked ${mod.latest.author.username}`);
  }

</script>

<div class="shadow-4 flex bg-neutral-background-1 flex-2 h-[120px] p-[7.5px] rounded-[17.5px] gap-2">
  <ModIcon src="{import.meta.env.VITE_API_BASE_URL}/cdn/icon/default.png"/>
  <div class="grid h-fit gap-2">
    <div class="flex flex-row flex-1 gap-1 h-fit w-fit mt-1">
      <span class="text-2xl leading-5">{mod.mod.name}</span>
      <span class="text-md text-neutral-foreground-2">By <Link as="button" on:click={() => searchProfile(mod)} inline={true}>{mod.latest.author.username}</Link></span>
    </div>
    <p class="text-neutral-foreground-3">{mod.mod.description}</p>
  </div> 
  <div class="grid h-full gap-2 w-[175px] ml-auto min-w-[175px]">
    <div class="flex flex-row gap-2 mt-auto ml-auto w-fit">
      <svg viewBox="0 0 20 20" class="w-6 h-6 text-neutral-foreground-2">
        <ArrowSyncFilled class="w-6 h-6"/>
      </svg>
      <span class="text-neutral-foreground-2">{getRelativeTimeString(new Date(mod.mod.updatedAt))}</span>
    </div>
  </div> 
</div>

<style>
  
</style>
