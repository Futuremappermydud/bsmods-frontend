<script lang="ts">
    import type { EditApproval } from "$lib/types/Approval";
    import axios from "axios";
    import type { SupportedGameVersion } from "$lib/types/Mods";
    import { appendURL } from "$lib/utils/url";
    import EditApprovalCard from "./EditApprovalCard.svelte";
  
    let {
      edits,
    }: {
      edits: EditApproval[];
    } = $props();

    let doneLoading = $state(false);
    let gameVersions:SupportedGameVersion[] = $state([]);

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
    {#each edits as edit}
      <EditApprovalCard edit={edit} gameVersions={gameVersions} />
    {/each}
  </div>
{/if}
  