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
          h3: "fix",
          h4: "fix",
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
    line-height: 1.5 !important;
  }

  :global(p.fix) {
    @apply mb-4 mt-0 !text-neutral-foreground-2;
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
  :global(h1.fix) {
    @apply mb-4 border-b-[1px] border-solid border-neutral-foreground-disabled pb-1 pt-2;
  }

  :global(h1.fix) {
    @apply !h-14;
  }

  :global(h2.fix) {
    @apply !h-10;
  }

  :global(h3.fix) {
    @apply my-0 !h-8 font-semibold;
  }

  :global(h4.fix) {
    @apply my-5 !h-8 font-semibold;
  }

  :global(a.fix) {
    @apply !text-blue-500 duration-100 hover:!text-blue-400;
  }

  :global(a.fix > img) {
    @apply !inline;
  }
</style>
