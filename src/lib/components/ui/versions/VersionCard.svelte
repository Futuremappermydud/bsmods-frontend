<script lang="ts">
  import type { ModVersion } from "$lib/types/Mods";
  import { Button } from "@svelte-fui/core";

  let { version }: { version: ModVersion } = $props();
</script>

<div
  class="flex flex-col gap-8 items-stretch bg-neutral-background-2 shadow-4 rounded-xl p-4"
>
  <div class="flex flex-col flex-1 gap-2">
    <p class="flex-1 text-lg font-semibold">{version.modVersion}</p>
    <div>
      <p class="font-semibold">Supports:</p>
      <p class="flex-1 text-sm">
        {version.supportedGameVersions.map((x) => x.version).join(", ")}
      </p>
    </div>
  </div>
  <Button
    class="flex-1"
    onclick={() => {
      window.open(`https://bbm.saera.gay/cdn/mod/${version.zipHash}.zip`);
    }}>Download</Button
  >
</div>
