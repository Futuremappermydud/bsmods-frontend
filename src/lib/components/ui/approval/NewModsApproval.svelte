<script lang="ts">
    import type { DisplayApprovalModalFunction, DisplayModalFunction } from "$lib/types/Approval";
  import type { Mod } from "$lib/types/Mods";
  import ModCardApproval from "../mods/ModCardApproval.svelte";

  let {
    mods,
    displayModal,
    displayApprovalModal,
  }: {
    mods: Mod[];
    displayModal: DisplayModalFunction,
    displayApprovalModal: DisplayApprovalModalFunction;
  } = $props();
</script>

<div class="flex flex-col gap-4">
  {#each mods as mod}
    <ModCardApproval {mod} {displayModal} {displayApprovalModal} />
  {/each}
</div>
