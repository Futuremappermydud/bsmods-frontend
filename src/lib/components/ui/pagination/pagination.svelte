<script lang="ts">
  import {
    ChevronLeftRegular,
    ChevronRightRegular,
    MoreHorizontalRegular,
  } from "@svelte-fui/icons";
  import type { derived } from "svelte/store";
  import Tab from "../tablist/Tab.svelte";
  import TabList from "../tablist/TabList.svelte";

  let {
    totalItems,
    pageSize,
    currentPage = $bindable(1),
    limit,
    onSetPage,
  }: {
    totalItems: number;
    pageSize: number;
    currentPage: number;
    limit: number;
    onSetPage: (page: number) => void;
  } = $props();

  interface Page {
    type: "number" | "ellipsis";
    value: number;
  }

  let totalPages = $derived(Math.ceil(totalItems / pageSize));

  let pages: Page[] = $derived.by(() => {
    let pages: Page[] = [];
    let start = Math.max(1, currentPage - limit);
    let end = Math.min(totalPages, currentPage + limit);

    if (start > 1) {
      pages.push({ type: "number", value: 1 });
    }

    if (start > 2) {
      pages.push({ type: "ellipsis", value: 0 });
    }

    for (let i = start; i <= end; i++) {
      pages.push({ type: "number", value: i });
    }

    if (end < totalPages - 1) {
      pages.push({ type: "ellipsis", value: 0 });
    }

    if (end < totalPages) {
      pages.push({ type: "number", value: totalPages });
    }

    return pages;
  });
</script>

<div class="flex h-6 flex-row items-center justify-center">
  <button
    class="aspect-square h-full"
    onclick={() => {
      onSetPage(currentPage - 1);
    }}
    disabled={currentPage === 1}
    class:text-neutral-foreground-disabled={currentPage === 1}
  >
    <svg viewBox="0 0 20 20">
      <ChevronLeftRegular />
    </svg>
  </button>
  <TabList layout="horizontal" bind:value={currentPage}>
    {#each pages as page}
      {#if page.type === "number"}
        <Tab
          on:click={() => onSetPage(page.value)}
          value={page.value}
          name="paginate"
        >
          {page.value}
        </Tab>
      {:else}
        <svg class="mb-3 mt-auto h-4 w-4">
          <MoreHorizontalRegular class="h-4 w-4" />
        </svg>
      {/if}
    {/each}
  </TabList>
  <button
    class="aspect-square h-full"
    onclick={() => {
      onSetPage(currentPage + 1);
    }}
    disabled={currentPage === totalPages}
    class:text-neutral-foreground-disabled={currentPage === totalPages}
  >
    <svg viewBox="0 0 20 20">
      <ChevronRightRegular />
    </svg>
  </button>
</div>
