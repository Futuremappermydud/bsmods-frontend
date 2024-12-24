<script lang="ts">
  import { Markdown } from "svelte-exmarkdown";
  import type { Plugin } from "svelte-exmarkdown";
  import { gfmPlugin } from "svelte-exmarkdown/gfm";
  import Tab from "../tablist/Tab.svelte";
  import TabList from "../tablist/TabList.svelte";
  import TextArea from "../textarea/TextArea.svelte";
  import addClasses from "rehype-class-names";
  import { z } from "zod";
  import { Field, FieldMessageError } from "@svelte-fui/core";

  let {
    text = $bindable(),
    descriptionScheme,
  }: { text: string; descriptionScheme: z.Schema } = $props();

  let descriptionTab = $state("write");
  let descriptionValidity = $derived(descriptionScheme.safeParse(text));

  const existingPluginArray: Plugin[] = [
    gfmPlugin(),
    {
      rehypePlugin: [
        addClasses,
        {
          h1: "fix",
          h2: "fix",
          a: "fix",
          p: "fix",
          li: "fix",
          ul: "fix",
          ol: "fix",
        },
      ],
    },
  ];
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
      <Markdown md={text} plugins={existingPluginArray} />
    </div>
  {/if}
</div>

<style lang="postcss">
  :global(.fix) {
    color: revert !important;
    font-size: revert !important;
    font-weight: revert !important;
    line-height: revert !important;
  }

  :global(p.fix) {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  :global(ul > li.fix) {
    list-style: disc;
  }

  :global(ol > li.fix) {
    list-style: decimal;
  }

  :global(ul.fix),
  :global(ol.fix) {
    @apply mb-4 pl-5;
  }

  :global(h2.fix),
  :global(h1.fix),
  :global(h3.fix) {
    @apply border-b-[1px] border-neutral-foreground-disabled border-solid mb-4 pt-2 pb-1;
  }
</style>
