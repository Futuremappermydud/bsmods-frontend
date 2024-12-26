<script lang="ts">
  import { Divider } from "@svelte-fui/core";

  let { tab }: { tab: string } = $props();
</script>

<div
  class="w-full flex flex-col gap-4 transition-opacity duration-75 ease-in items-center"
  class:opacity-0={tab === ""}
  class:hidden={tab === "" || tab === "new"}
>
  <Divider class="w-72 mt-2" />
  <p class="text-3xl mt-12">
    <span class="text-neutral-foreground-4">2.</span> Pick Your Mod
  </p>
</div>
