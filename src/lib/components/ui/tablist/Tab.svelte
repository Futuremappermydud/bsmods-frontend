<script lang="ts">
  import { Label } from "@svelte-fui/core";
  import { nanoid } from "nanoid";
  import { getTabListContext } from "./context";

  const { disabled$, required$, name$, value$, layout$, methods } =
    getTabListContext();

  export let id: string | undefined = nanoid();
  export let name: string | undefined = nanoid();
  export let value: string | number | undefined = undefined;
  export let disabled: boolean | undefined = undefined;

  $: _name = $name$ || name;
  $: isVertical = $layout$ === "vertical";
  $: _disabled = $disabled$ || disabled;

  function onclick() {
    if (!value) return;

    methods.select(value);
  }
</script>

<div
  class="fui-tab"
  class:horizontal={!isVertical}
  class:vertical={isVertical}
  on:click={onclick}
  on:click
>
  <input
    type="radio"
    {id}
    name={_name}
    class="fui-tab-input"
    class:enabled={$value$ === value}
    {value}
    disabled={_disabled}
    required={$required$}
    on:change
  />
  {#if $$slots.default}
    <Label for={id} class="fui-tab-label">
      <slot />
    </Label>
  {/if}
</div>

<style lang="postcss">
  .fui-tab {
    @apply relative inline-flex w-fit items-center px-[10px] py-m;

    &.vertical {
      @apply flex-col items-center py-sNudge;
    }
  }

  .fui-tab-input {
    @apply absolute left-0 top-0 h-full w-full cursor-pointer opacity-0;

    /* Colors for the unchecked state */
    &:enabled:not(.enabled) {
      & ~ :global(.fui-tab-label) {
        @apply font-regular text-neutral-foreground-3;
      }

      &:hover {
        & ~ :global(.fui-tab-label) {
          @apply text-neutral-foreground-2;
        }
      }

      &:hover:active {
        & ~ :global(.fui-tab-label) {
          @apply text-neutral-foreground-1;
        }
      }
    }

    /* Colors for the checked state */
    &.enabled:enabled {
      & ~ :global(.fui-tab-label) {
        @apply font-semibold text-neutral-foreground-1;
      }
    }

    /* Colors for the disabled state */
    &:disabled {
      cursor: not-allowed !important;

      & ~ :global(.fui-tab-label) {
        @apply pointer-events-none !cursor-not-allowed text-neutral-foreground-disabled;
      }
    }
  }

  .fui-tab > :global(.fui-tab-label) {
    @apply cursor-pointer self-center px-0.5;
  }

  /* Tab underline */
  .fui-tab:not(:has(.fui-tab-input:disabled))::after {
    @apply absolute bottom-0 left-0 rounded-circular content-[''];
  }

  /* Colors for the selected state */
  .fui-tab:has(.fui-tab-input.enabled)::after {
    @apply bg-brand-stroke-1;
  }

  /* Colors for the hovered state */
  .fui-tab:hover::after {
    @apply bg-neutral-stroke-1;
  }

  /* Layout for the vertical state */
  .fui-tab.vertical::after {
    @apply bottom-0 top-0 my-2 h-auto min-h-4 w-1;
  }

  /* Layout for the horizontal state */
  .fui-tab.horizontal::after {
    @apply right-0 mx-auto h-1 w-fit min-w-4;
  }
</style>
