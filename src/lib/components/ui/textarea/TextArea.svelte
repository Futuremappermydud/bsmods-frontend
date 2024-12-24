<script lang="ts">
  import { InputSkin } from "@svelte-fui/core";
  import clsx from "clsx";
  import { extendTailwindMerge } from "tailwind-merge";
  import { tailwindcssConfig, defaultTheme } from "@svelte-fui/tailwindcss";

  type InputEvent = Event & {
    currentTarget: EventTarget & HTMLInputElement;
  };

  /** The input's current value. */
  export let value: any = "";
  export let valueAsNumber: number | undefined = undefined;
  export let valueAsDate: Date | undefined | null = undefined;

  /** The initial placeholder text displayed if no value is present. */
  export let placeholder: string | undefined = undefined;

  /** Determines whether the textbox can be typed in or not. */
  export let readonly = false;

  /** Controls whether the TextBox is intended for user interaction, and styles it accordingly. */
  export let disabled = false;

  export let underline = false;

  export let name: string | undefined = undefined;

  export let ariaLabel: string | undefined = undefined;

  export let ariaDescribedby: string | undefined = undefined;

  export let ariaInvalid = false;

  /** Specifies a custom class name for the TextBox container. */
  let klass = "";
  export { klass as class };

  /** Specifies a custom class name for the Component container. */
  export let componentClass = "";

  export let id: string | undefined = undefined;

  function oninput(e: InputEvent) {
    const currentTarget = e.currentTarget as HTMLInputElement;
    valueAsNumber = currentTarget.valueAsNumber;
    valueAsDate = currentTarget.valueAsDate;
  }

  const custom_tw_merge = extendTailwindMerge({
    extend: {
      theme: {
        spacing: [
          ...new Set([
            ...Object.keys(defaultTheme.spacing ?? {}),
            ...Object.keys(tailwindcssConfig.theme.extend.spacing ?? {}),
          ]),
        ],
        borderWidth: Object.keys(tailwindcssConfig.theme.extend.borderWidth),
      },
    },
  });
  function classnames(...args: any[]) {
    return custom_tw_merge(clsx(...args));
  }
</script>

<InputSkin
  class={classnames(
    "fui-text-area",
    { underline, disabled, invalid: ariaInvalid && !disabled },
    componentClass,
  )}
  {id}
>
  {#if $$slots.before}
    <div class="flex h-full items-center">
      <slot name="before" />
    </div>
  {/if}

  <textarea
    class={classnames(
      "px-xxs text-neutral-foreground-1 leading-inherit flex-1 border-none bg-transparent h-full",
      klass,
    )}
    {id}
    {name}
    {placeholder}
    {disabled}
    {readonly}
    aria-label={ariaLabel}
    aria-describedby={ariaDescribedby}
    aria-invalid={true}
    bind:value
    on:input={oninput}
    on:input
    on:blur
    on:keydown
    on:keypress
    on:keyup
    on:click
  ></textarea>

  {#if $$slots.after}
    <div class="flex h-full items-center">
      <slot name="after" />
    </div>
  {/if}
</InputSkin>

<style lang="postcss">
  :global(.fui-text-area) {
    padding: 5px !important;
  }

  textarea {
    @apply outline-none resize-none;
  }
</style>
