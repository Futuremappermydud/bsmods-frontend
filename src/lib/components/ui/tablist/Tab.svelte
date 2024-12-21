<script lang="ts">
  import { Label } from "@svelte-fui/core";
  import { nanoid } from "nanoid";
  import { getTabListContext } from "./context";

  const { disabled$, required$, value$, name$, layout$ } = getTabListContext();

  export let id: string | undefined = nanoid();
  export let name: string | undefined = nanoid();
  export let value: string | undefined = undefined;

  $: _name = $name$ || name;

  $: isVertical = $layout$ === 'vertical';

  function onclick() {
    value$.set(value);
    console.log(value);
  }
</script>

<div class="fui-tab" class:horizontal={!isVertical} class:vertical={isVertical} on:click={onclick} on:click>
  <input
    type="radio"
    {id}
    name={_name}
    bind:value
    class="fui-tab-input"
    disabled={$disabled$}
    required={$required$}
    alt="Tab"
  />
  {#if $$slots.default}
    <Label for={id} class="fui-tab-label">
      <slot />
    </Label>
  {/if}
</div>

<style lang="postcss">
  .fui-tab {
    @apply relative inline-flex items-center w-fit py-m px-[10px];

    &.vertical {
      @apply flex-col items-center py-sNudge;
    }
  }

  .fui-tab-input {
    @apply opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer;

    /* Colors for the unchecked state */
    &:enabled:not(:checked) {
      & ~ :global(.fui-tab-label) {
        @apply text-neutral-foreground-3 font-regular;
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
    &:enabled:checked {
      & ~ :global(.fui-tab-label) {
        @apply text-neutral-foreground-1 font-semibold;
      }
    }

    /* Colors for the disabled state */
    &:disabled {
      & ~ :global(.fui-tab-label) {
        @apply text-neutral-foreground-disabled cursor-default;
      }
    }
  }

  .fui-tab > :global(.fui-tab-label) {
    @apply px-0.5 cursor-pointer self-center;
  }

  /* Tab underline */
  .fui-tab::after {
    @apply content-[''] absolute bottom-0 left-0 rounded-circular;
  }

  /* Colors for the selected state */
  .fui-tab:has(.fui-tab-input:checked)::after {
    @apply bg-brand-stroke-1;
  }

  /* Colors for the hovered state */
  .fui-tab:hover::after {
    @apply bg-neutral-stroke-1;
  }

  /* Layout for the vertical state */
  .fui-tab.vertical::after {
    @apply h-auto w-1 bottom-0 top-0 my-2;
  }
  
  /* Layout for the horizontal state */
  .fui-tab.horizontal::after {
    @apply w-auto h-1 right-0 mx-3;
  }
</style>
