<script lang="ts">
  import type { DisplayApprovalModalFunction, DisplayModalFunction, VersionApproval } from "$lib/types/Approval";
  import axios from "axios";
  import ModVersionApprovalCard from "../mods/ModVersionApprovalCard.svelte";
  import type { SupportedGameVersion } from "$lib/types/Mods";
  import { appendURL } from "$lib/utils/url";
  import { onMount } from "svelte";
  import { Status } from "$lib/types/Status";

  let {
    modVersions,
    displayModal,
    displayApprovalModal,
  }: {
    modVersions: VersionApproval[];
    displayModal: DisplayModalFunction;
    displayApprovalModal: DisplayApprovalModalFunction;
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

  onMount(() => {
    //sort the modVerisons array by oldest submission
    modVersions.sort((a, b) => {
      let aStatuses = a.version.statusHistory.filter(
        (status) =>
          status.status === Status.Pending ||
          status.status === Status.Unverified,
      );
      let bStatuses = b.version.statusHistory.filter(
        (status) =>
          status.status === Status.Pending ||
          status.status === Status.Unverified,
      );

      let aDate;
      let bDate;
      if (aStatuses.length > 0) {
        aDate = new Date(aStatuses[aStatuses.length - 1].setAt);
      } else {
        aDate = new Date(a.version.createdAt);
      }
      if (bStatuses.length > 0) {
        bDate = new Date(bStatuses[bStatuses.length - 1].setAt);
      } else {
        bDate = new Date(b.version.createdAt);
      }

      return aDate.getTime() - bDate.getTime();
    });
    getVersions();
  });
</script>

{#if doneLoading}
  <div class="flex flex-col gap-4">
    {#each modVersions as modVersion}
      <ModVersionApprovalCard versionApproval={modVersion} {gameVersions} {displayModal} {displayApprovalModal} />
    {/each}
  </div>
{/if}
