<script lang="ts">
  import { nanoid } from "nanoid";
  import { writable } from "svelte/store";
  import { setTabListContext } from "./context";
  import type { Layout } from "./types";

  export let name: string = nanoid();
  export let value: string | undefined = undefined;
  export let layout: Layout = "vertical";
  export let disabled = false;
  export let required = false;

  const { disabled$, required$, value$, name$, layout$ } = setTabListContext({
    disabled$: writable(disabled),
    required$: writable(required),
    value$: writable(value),
    name$: writable(name),
    layout$: writable(layout),
    methods: {
      select,
    },
  });

  $: disabled$.set(disabled);
  $: required$.set(required);
  $: value$.set(value);
  $: name$.set(name);
  $: layout$.set(layout);

  function select(tab_value: string) {
    value = tab_value;
  }
</script>

<div
  class="fui-tab-list"
  class:vertical={layout === "vertical"}
  role="radiogroup"
  {...$$restProps}
>
  <slot />
</div>

<style lang="postcss">
  .fui-tab-list {
    @apply flex h-fit w-fit items-start;

    &.vertical {
      @apply flex-col;
    }
  }
</style>
