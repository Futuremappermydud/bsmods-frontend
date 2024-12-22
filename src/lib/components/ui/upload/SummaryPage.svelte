<script lang="ts">
  import { Markdown } from "svelte-exmarkdown";
  import type { Plugin } from "svelte-exmarkdown";
  import { gfmPlugin } from "svelte-exmarkdown/gfm";
  import Tab from "../tablist/Tab.svelte";
  import TabList from "../tablist/TabList.svelte";
  import TextArea from "../textarea/TextArea.svelte";
  import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
  import { createHighlighter } from "shiki/bundle/web";
  import addClasses from 'rehype-class-names';

  let { text = $bindable() } = $props();

  let summaryTab = $state("write");

  const existingPluginArray: Plugin[] = [
    gfmPlugin(),
    {
        rehypePlugin: [
            addClasses, { 
                h1: "fix", 
                h2: "fix", 
                a: "fix",
                p: "fix",
                li: "fix",
                ul: "fix",
                ol: "fix"
            }
        ],
    }
];

  const shikiPluginPromise = createHighlighter({
    themes: [import("shiki/themes/vitesse-dark.mjs")],
    langs: ["html", "js", "ts", "json", "xml", "yml"],
  }).then((highlighter): Plugin => {
    return {
      rehypePlugin: [
        rehypeShikiFromHighlighter,
        highlighter,
        { theme: "vitesse-dark" },
      ],
    };
  });
</script>

<div class="flex flex-col gap-1 items-center flex-[4] h-full">
  <TabList disabled={false} layout="horizontal" bind:value={summaryTab}>
    <Tab value="write">Write</Tab>
    <Tab value="preview">Markdown Preview</Tab>
  </TabList>
  {#if summaryTab == "write"}
    <TextArea
      placeholder="Summary"
      componentClass="!h-full w-full mx-4"
      bind:value={text}
    />
  {/if}
  {#if summaryTab == "preview"}
    <div class="md-container w-full flex-1 overflow-scroll text-left border-neutral-foreground-disabled border-solid border-2 p-1 rounded">
      {#await shikiPluginPromise}
        <Markdown md={text} plugins={existingPluginArray} />
      {:then shikiPlugin}
        <Markdown md={text} plugins={[shikiPlugin, ...existingPluginArray]} />
      {:catch}
        <Markdown md={text} plugins={existingPluginArray} />
      {/await}
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

  :global(ul.fix), :global(ol.fix) {
    @apply mb-4 pl-5;
  }

  :global(h2.fix), :global(h1.fix), :global(h3.fix) {
    @apply border-b-[1px] border-neutral-foreground-disabled border-solid mb-4 pt-2 pb-1;
  }
</style>
