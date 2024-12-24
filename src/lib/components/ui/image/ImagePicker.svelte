<script lang="ts">
  import { Icon } from "@svelte-fui/core";
  import { AddRegular, PulseRegular } from "@svelte-fui/icons";

  let fileinput: HTMLInputElement | null = $state(null);

  const onFileSelected = (e) => {
    console.log("hsd");
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      avatar = e.target?.result;
    };
  };

  let {
    classProp,
    imageProp,
    avatar = $bindable(null),
  }: { classProp: string; imageProp: string; avatar: any } = $props();
</script>

<div class={classProp}>
  {#if avatar}
    <div class="relative">
      <button
        class="rounded-circular bg-neutral-background-2 absolute top-2 right-2 w-4 h-4 opacity-85 flex items-end justify-center cursor-pointer"
        onclick={() => {
          avatar = null;
        }}
      >
        x
      </button>
    </div>
  {/if}
  <button
    class="w-full h-full"
    onclick={() => {
      fileinput?.click();
    }}
  >
    {#if avatar}
      <img class="cursor-pointer {imageProp}" src={avatar} alt="Mod Icon" />
    {:else}
      <div
        class="mod-add-icon duration-100 h-full flex justify-center rounded-xl border-2 border-dashed border-neutral-foreground-disabled"
      >
        <Icon class="h-8 w-8 self-center text-neutral-foreground-disabled">
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
  .mod-add-icon:hover > .fui-icon {
    @apply !text-neutral-background-1-hover;
  }
</style>
