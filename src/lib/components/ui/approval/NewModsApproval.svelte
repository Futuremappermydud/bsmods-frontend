<script lang="ts">
    import type { DisplayModalFunction } from "$lib/types/Approval";
  import type { Mod } from "$lib/types/Mods";
  import ModCardApproval from "../mods/ModCardApproval.svelte";

  let {
    mods,
    displayModal,
  }: {
    mods: Mod[];
    displayModal: DisplayModalFunction
  } = $props();
</script>

<div class="flex flex-col gap-4">
  {#each mods as mod}
    <ModCardApproval {mod} {displayModal} />
  {/each}
</div>
