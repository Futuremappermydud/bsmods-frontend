<script lang="ts">
  import type { Mod } from "$lib/types/Mods";
  import { Button, Field, FieldMessageError, Input } from "@svelte-fui/core";
  import ModCardBase from "./ModCardBase.svelte";
  import ImagePicker from "../image/ImagePicker.svelte";
  import { z } from "zod";
  import { isValidSquareImage } from "$lib/utils/image";
  import { Categories } from "$lib/types/Categories";
  import TextArea from "../textarea/TextArea.svelte";

  let {
    mod,
    isMadeByUser,
    editing = $bindable(false),
    modName = $bindable(),
    summary = $bindable(),
    icon = $bindable(),
    iconFile = $bindable(),
    saveFunc,
  }: {
    mod: Mod;
    isMadeByUser: boolean;
    editing: boolean;
    modName: string | undefined;
    summary: string | undefined;
    icon: string | undefined;
    iconFile: File | undefined;
    saveFunc: () => void;
  } = $props();

  // Metadata Validation

  let modNameScheme = z
    .string()
    .min(3, "Name must contain at least 3 character(s)")
    .max(20, "Name must contain at most 20 character(s)");
  let categoryScheme = z
    .string()
    .refine((value) => Object.keys(Categories).includes(value));
  let summaryScheme = z
    .string()
    .min(10, "Summary must contain at least 10 character(s)")
    .max(200, "Summary must contain at most 200 character(s)");
  let iconScheme = z
    .string()
    .nonempty("Icon must be provided")
    .refine(async (value) => {
      //check base64 image to be a square
      return await isValidSquareImage(value);
    }, "Icon must be square");

  let modNameValidity = $derived(modNameScheme.safeParse(modName));
  let summaryValidity = $derived(summaryScheme.safeParse(summary));

  let cancelClicks = $state(0);
  function cancel() {
    cancelClicks += 1;
    if (cancelClicks > 1) {
      saveClicks = 0;
      cancelClicks = 0;
      editing = false;
    }
  }

  let saveClicks = $state(0);
  function save() {
    saveClicks += 1;
    if (saveClicks > 1) {
      saveClicks = 0;
      cancelClicks = 0;
      saveFunc();
      editing = false;
    }
  }
</script>

{#snippet editingMarker()}
  {#if isMadeByUser}
    <div class="ml-auto flex flex-col gap-2">
      {#if editing}
        <div class="ml-auto flex flex-col gap-2">
          <Button on:click={cancel}>
            <div class="flex flex-row gap-2">
              <div
                class="h-2 w-2 rounded-circular bg-neutral-foreground-3 opacity-20"
                class:!opacity-80={cancelClicks > 0}
              ></div>
              <div
                class="h-2 w-2 rounded-circular bg-neutral-foreground-3 opacity-20"
                class:!opacity-80={cancelClicks > 1}
              ></div>
            </div>
            Cancel
          </Button>
          <Button on:click={save}>
            <div class="flex flex-row gap-2">
              <div
                class="h-2 w-2 rounded-circular bg-neutral-foreground-3 opacity-20"
                class:!opacity-80={saveClicks > 0}
              ></div>
              <div
                class="h-2 w-2 rounded-circular bg-neutral-foreground-3 opacity-20"
                class:!opacity-80={saveClicks > 1}
              ></div>
            </div>
            Save*
          </Button>
        </div>
        <div class="mt-auto">
          <p>* Saving an edit requires approval</p>
        </div>
      {:else}
        <Button on:click={() => (editing = true)}>Edit</Button>
      {/if}
    </div>
  {/if}
{/snippet}

{#if !editing}
  <ModCardBase
    {mod}
    author={mod.authors}
    slot={editingMarker}
    smallCorners={true}
  />
{:else}
  <div
    class="flex-2 pointer-events-auto flex h-28 cursor-pointer gap-2 rounded-xl bg-neutral-background-2 p-[7.5px] shadow-4 md:h-[160px] md:cursor-default"
  >
    <ImagePicker
      classProp="aspect-square max-w-[160px] max-h-[160px]"
      imageProp="rounded-[6px]"
      required={false}
      bind:avatar={icon}
      bind:file={iconFile}
      {iconScheme}
    />
    <div class="grid h-auto gap-2">
      <div class="flex h-auto w-[400px] flex-1 flex-row gap-1">
        <Field
          label="Mod Name"
          orientation="horizontal"
          state={modNameValidity.success ? "success" : "error"}
        >
          <Input bind:value={modName} ariaInvalid={!modNameValidity.success} />
          <FieldMessageError open={!modNameValidity.success}
            >{modNameValidity.error?.format()._errors}</FieldMessageError
          >
        </Field>
      </div>
      <Field
        label="Summary"
        state={summaryValidity.success ? "success" : "error"}
      >
        <TextArea
          componentClass="!h-full w-full"
          placeholder="200 characters on why your mod is the best"
          bind:value={summary}
          ariaInvalid={!summaryValidity.success}
        />
        <FieldMessageError open={!summaryValidity.success}
          >{summaryValidity.error?.format()._errors[0]}</FieldMessageError
        >
      </Field>
    </div>
    {@render editingMarker()}
  </div>
{/if}

<style lang="postcss">
  :global(.fui-field:not(:has(.fui-text-area))) {
    @apply w-full !p-0;
    grid-template-columns: auto 1fr !important;
  }

  :global(.fui-label) {
    @apply !w-fit;
  }
</style>
