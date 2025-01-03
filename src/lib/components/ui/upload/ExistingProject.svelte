<script lang="ts">
  import { Divider } from "@svelte-fui/core";

  let { tab }: { tab: string } = $props();
</script>

<div
  class="flex w-full flex-col items-center gap-4 transition-opacity duration-75 ease-in"
  class:opacity-0={tab === ""}
  class:hidden={tab === "" || tab === "new"}
>
  <Divider class="mt-2 w-72" />
  <p class="mt-12 text-3xl">
    <span class="text-neutral-foreground-4">2.</span> Pick Your Mod
  </p>
</div>
