<script lang="ts">
  import type { VersionApproval } from "$lib/types/Approval";
  import axios from "axios";
  import ModVersionApprovalCard from "../mods/ModVersionApprovalCard.svelte";
  import type { SupportedGameVersion } from "$lib/types/Mods";
  import { appendURL } from "$lib/utils/url";

  let {
    modVersions,
  }: {
    modVersions: VersionApproval[];
  } = $props();

  let doneLoading = $state(false);
  let gameVersions: SupportedGameVersion[] = $state([]);

  async function getVersions() {
    axios.get(appendURL(`api/versions`)).then((response) => {
      if (response.status === 200 && response.data && response.data.versions) {
        gameVersions = response.data.versions;
      }
    });
    doneLoading = true;
  }
  getVersions();
</script>

{#if doneLoading}
  <div class="flex flex-col gap-4">
    {#each modVersions as modVersion}
      <ModVersionApprovalCard versionApproval={modVersion} {gameVersions} />
    {/each}
  </div>
{/if}
