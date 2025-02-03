<script lang="ts">
  import Tab from "../tablist/Tab.svelte";
  import TabList from "../tablist/TabList.svelte";
  import TextArea from "../textarea/TextArea.svelte";
  import { z } from "zod";
  import { Field, FieldMessageError } from "@svelte-fui/core";
  import MarkdownViewer from "../markdown/MarkdownViewer.svelte";

  let {
    text = $bindable(),
    descriptionScheme,
    modPage,
  }: {
    text: string | undefined;
    descriptionScheme: z.Schema;
    modPage?: boolean;
  } = $props();

  let descriptionTab = $state("write");
  let descriptionValidity = $derived(descriptionScheme.safeParse(text));
</script>

<div class="description flex h-full flex-[4] flex-col items-center gap-1">
  <TabList disabled={false} layout="horizontal" bind:value={descriptionTab}>
    <Tab value="write">Write</Tab>
    <Tab value="preview">Markdown Preview</Tab>
  </TabList>
  {#if descriptionTab == "write"}
    <Field
      label="Description"
      state={descriptionValidity.success ? "success" : "error"}
    >
      <TextArea
        placeholder="Description"
        componentClass="!h-full w-full"
        bind:value={text}
        ariaInvalid={!descriptionValidity.success}
      />
      <FieldMessageError open={!descriptionValidity.success}>
        {descriptionValidity.error?.format()._errors[0]}
      </FieldMessageError>
    </Field>
  {/if}
  {#if descriptionTab == "preview"}
    <div
      class="md-container w-full flex-1 overflow-scroll rounded border-2 border-solid border-neutral-foreground-disabled p-1 text-left"
    >
      <MarkdownViewer text={text ?? ""} />
    </div>
  {/if}
</div>

<style lang="postcss">
  :global(.description) {
    :global(.fui-field) {
      @apply !flex !h-full !flex-col;
    }
  }
</style>
