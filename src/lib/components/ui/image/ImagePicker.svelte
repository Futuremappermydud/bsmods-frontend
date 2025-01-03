<script lang="ts">
  import { Icon } from "@svelte-fui/core";
  import { AddRegular, PulseRegular } from "@svelte-fui/icons";

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
  }: {
    classProp: string;
    imageProp: string;
    avatar: any;
    file: File | null | undefined;
  } = $props();
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
      <img class="cursor-pointer {imageProp}" src={avatar} alt="Mod Icon" />
    {:else}
      <div
        class="mod-add-icon flex h-full justify-center rounded-xl border-2 border-dashed border-neutral-foreground-disabled duration-200"
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
</div>

<style lang="postcss">
  .mod-add-icon:hover {
    @apply border-neutral-background-1-hover;
  }
  .mod-add-icon:hover > :global(.fui-icon) {
    @apply !text-neutral-background-1-hover;
  }
</style>
