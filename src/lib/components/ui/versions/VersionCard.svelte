<script lang="ts">
  import type { ModVersion } from "$lib/types/Mods";
  import { appendURL } from "$lib/utils/url";
  import { Button } from "@svelte-fui/core";

  let { version }: { version: ModVersion } = $props();
</script>

<div
  class="relative flex flex-col items-stretch gap-8 rounded-xl bg-neutral-background-2 p-4 shadow-4"
>
  <div class="flex flex-1 flex-col gap-2">
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
      window.open(appendURL(`cdn/mod/${version.zipHash}.zip`));
    }}>Download</Button
  >
  <div class=""></div>
</div>
