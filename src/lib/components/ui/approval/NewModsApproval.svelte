<script lang="ts">
  import type { Mod } from "$lib/types/Mods";
  import ModCardApproval from "../mods/ModCardApproval.svelte";

  let {
    mods,
  }: {
    mods: Mod[];
  } = $props();
</script>

<div class="flex flex-col gap-4">
  {#each mods as mod}
    <ModCardApproval {mod} />
  {/each}
</div>
