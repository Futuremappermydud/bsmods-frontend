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
  }: { text: string; descriptionScheme: z.Schema } = $props();

  let descriptionTab = $state("write");
  let descriptionValidity = $derived(descriptionScheme.safeParse(text));
</script>

<div class="flex flex-col gap-1 items-center flex-[4] h-full pr-2 pb-2">
  <TabList disabled={false} layout="horizontal" bind:value={descriptionTab}>
    <Tab value="write">Write</Tab>
    <Tab value="preview">Markdown Preview</Tab>
  </TabList>
  {#if descriptionTab == "write"}
    <Field
      label="Summary"
      state={descriptionValidity.success ? "success" : "error"}
    >
      <TextArea
        placeholder="Summary"
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
      class="md-container w-full flex-1 overflow-scroll text-left border-neutral-foreground-disabled border-solid border-2 p-1 rounded"
    >
      <MarkdownViewer {text} />
    </div>
  {/if}
</div>
