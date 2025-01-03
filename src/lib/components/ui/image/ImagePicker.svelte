<script lang="ts">
  import { FieldMessage, Icon } from "@svelte-fui/core";
  import { AddRegular, ErrorCircleFilled } from "@svelte-fui/icons";
  import { z } from "zod";

  let fileinput: HTMLInputElement | null = $state(null);

  const onFileSelected = (e) => {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      avatar = e.target?.result;
      file = fileinput?.files?.item(0);
    };
  };

  let {
    classProp,
    imageProp,
    avatar = $bindable(null),
    file = $bindable(),
    iconScheme,
    required = false,
  }: {
    classProp: string;
    imageProp: string;
    avatar: any;
    file: File | null | undefined;
    iconScheme: z.Schema;
    required: boolean;
  } = $props();

  let iconValidity = $derived(iconScheme.safeParseAsync(avatar));
</script>

<div class={classProp}>
  {#if avatar}
    <div class="relative">
      <button
        class="absolute right-2 top-2 flex h-4 w-4 cursor-pointer items-end justify-center rounded-circular bg-neutral-background-2 opacity-85"
        onclick={() => {
          avatar = "";
          file = null;
        }}
      >
        x
      </button>
    </div>
  {/if}
  <button
    class="h-full w-full"
    onclick={() => {
      fileinput?.click();
    }}
  >
    {#if avatar}
      <img
        class="h-full w-full cursor-pointer {imageProp}"
        src={avatar}
        alt="Mod Icon"
      />
    {:else}
      <div
        class="mod-add-icon flex h-full justify-center rounded-xl border-2 border-dashed border-neutral-foreground-disabled duration-200"
        class:!border-palette-red-border-2={required && !avatar}
      >
        <Icon
          class="h-8 w-8 self-center text-neutral-foreground-disabled duration-200"
        >
          <svg viewBox="0 0 19 19">
            <AddRegular />
          </svg>
        </Icon>
      </div>
    {/if}
  </button>
  <input
    style="display:none"
    type="file"
    accept=".jpg, .jpeg, .png"
    onchange={(e) => onFileSelected(e)}
    onclick={(e) => e.stopPropagation()}
    bind:this={fileinput}
  />
  {#await iconValidity then validity}
    {#if required && !validity.success}
      <div
        class="mt-1 flex items-center gap-1 text-left text-xs leading-4 text-palette-red-foreground-1"
      >
        <Icon class="h-4 w-4">
          <svg viewBox="0 0 20 20">
            <ErrorCircleFilled />
          </svg>
        </Icon>
        {validity.error?.format()._errors[0]}
      </div>
    {/if}
  {/await}
</div>

<style lang="postcss">
  .mod-add-icon:hover {
    @apply border-neutral-background-1-hover;
  }
  .mod-add-icon:hover > :global(.fui-icon) {
    @apply !text-neutral-background-1-hover;
  }
</style>
