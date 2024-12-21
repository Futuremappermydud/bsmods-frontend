<script lang="ts">
  import {
    MoreHorizontalRegular,
    ChevronRightRegular,
  } from "@svelte-fui/icons";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "$lib/utils.js";

  type $$Props = HTMLAttributes<HTMLSpanElement>;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<span
  aria-hidden="true"
  class={cn("flex h-9 w-9 items-center justify-center", className)}
  {...$$restProps}
>
  <svg class="h-4 w-4">
    <MoreHorizontalRegular class="h-4 w-4" />
  </svg>
  <span class="sr-only">More pages</span>
</span>
