<script lang="ts">
  import { Markdown } from "svelte-exmarkdown";
  import type { Plugin } from "svelte-exmarkdown";
  import { gfmPlugin } from "svelte-exmarkdown/gfm";
  import addClasses from "rehype-class-names";

  let { text }: { text: string } = $props();

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

<Markdown md={text} plugins={existingPluginArray} />

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
    @apply mb-4 border-b-[1px] border-solid border-neutral-foreground-disabled pb-1 pt-2;
  }

  :global(h1.fix) {
    @apply h-11;
  }

  :global(h2.fix) {
    @apply h-9;
  }

  :global(h3.fix) {
    @apply h-8;
  }
</style>
