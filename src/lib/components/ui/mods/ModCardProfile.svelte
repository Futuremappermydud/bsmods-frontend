<script lang="ts">
  import type { Mod } from "$lib/types/Mods";
  import { Button, Link, Spinner } from "@svelte-fui/core";
  import ModCardBase from "./ModCardBase.svelte";
  import { CheckmarkRegular, DismissRegular } from "@svelte-fui/icons";

  let {
    mod,
  }: {
    mod: Mod;
  } = $props();
</script>

{#snippet privateMarker()}
  {#if mod.status === "private"}
    <div
      class="ml-auto flex h-5 w-16 justify-center rounded-circular border-[1px] border-solid border-palette-red-border-2 bg-neutral-background-1"
    >
      <p class="silly-capitalize text-xs">{mod.status}</p>
    </div>
  {/if}
{/snippet}

<ModCardBase {mod} author={mod.authors} slot={privateMarker} />
