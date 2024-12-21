<script lang="ts">
    import ModCardNeo from '$lib/components/ui/mods/ModCardNeo.svelte';
    import type { IndividualModData } from '$lib/types/Mods';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let mod: IndividualModData = data.mod.mod;
</script>


<div class="flex flex-col" >
  <ModCardNeo mod={mod.info} author={mod.versions[0].author} />
</div>
