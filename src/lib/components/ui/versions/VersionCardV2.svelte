<script lang="ts">
  import type { Mod, ModVersion } from "$lib/types/Mods";
  import { Status } from "$lib/types/Status";
  import { appendURL } from "$lib/utils/url";
  import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, Button, Label, Link, Spinner, Tooltip } from "@svelte-fui/core";
  import { ArrowDownloadRegular, InfoFilled, WarningFilled } from "@svelte-fui/icons";
  import { numify } from "numify";
  import axios from "axios";

  let {
    version,
    mod,
    isAuthor,
    isApprover,
  }: { version: ModVersion; mod: Mod; isAuthor: boolean; isApprover: boolean } =
    $props();

  let accordianValue = $state<string>('gv');

  // #region approval
  function sendSubmit() {
    axios
      .post(appendURL(`api/modVersions/${version.id}/submit`), {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          if (response.data !== null) {
            window.location.reload();
          }
        } else {
        }
      })
      .catch((error) => {
        console.error("An error occurred, contact a developer!");
        console.error(error);
      });
  }
  // #endregion approval
  // #region get additional data
  let depObjs: {mod: any, modVersion: any}[] = $state([]);
  let depObjsLoading = $state(true);
  function getDeps() {
    if (version.dependencies.length > 0 && depObjsLoading) {
      console.log(`Loading deps...`);
      axios
        .get(appendURL(`api/multi/modversions?id=${version.dependencies.join("&id=")}`))
        .then((response) => {
          if (response.status === 200 && response.data && response.data.mods) {
            depObjs = response.data.mods as {mod: any, modVersion: any}[];
            depObjsLoading = false;
          }
        });
    } else {
      depObjsLoading = false;
    }
  }
</script>

<div
  class="relative flex flex-col gap-1 rounded-xl bg-neutral-background-2 p-4 shadow-4"
>
  <!-- #region top bar-->
  <div class="flex flex-col gap-2">
    <div class="flex flex-row items-center gap-2">
      <!-- Redundant, yes, but I think in this card format, it looks much better -->
      <p class="flex-1 text-lg font-semibold">
        {mod.name} v{version.modVersion}
      </p>

      <div
        class="flex flex-row items-center gap-1 rounded-md bg-neutral-background-3 py-1 px-1 pr-2"
      >
        <svg viewBox="0 0 20 20" class="h-4 w-4 text-neutral-foreground-2 md:w-4">
          <ArrowDownloadRegular />
        </svg>
        <p class="text-sm text-neutral-foreground-2 p-0 md:text-base">
          {numify(version.downloadCount)}
        </p>
      </div>

      <!-- design is my passion - please revisit these colors, theyre fucked  -->
      {#if version.status === Status.Verified}
        <p class="silly-capitalize rounded-md bg-green-700 p-1 text-sm">
          {version.status}
        </p>
      {:else if version.status === Status.Pending}
        <p class="silly-capitalize rounded-md bg-purple-700 p-1 text-sm">
          {version.status}
        </p>
      {:else if version.status === Status.Unverified}
        <p class="silly-capitalize rounded-md bg-orange-700 p-1 text-sm">
          {version.status}
        </p>
      {:else if version.status === Status.Private}
        <p class="silly-capitalize rounded-md bg-blue-700 p-1 text-sm">
          {version.status}
        </p>
      {:else if version.status === Status.Removed}
        <p class="silly-capitalize rounded-md bg-red-700 p-1 text-sm">
          {version.status}
        </p>
      {/if}
      <!--<div class="flex flex-row bg-neutral-background-3 rounded-md p-1 px-1 items-center gap-1">
        <Tooltip>
          <svg viewBox="0 0 20 20" class="w-6 text-neutral-foreground-2  md:w-6">
            <InfoFilled />
          </svg>
          <span slot="content">
            ID: {version.id}<br>
            {#if version.dependencies.length > 0}
              Dependency IDs: {version.dependencies.join(`, `)}<br>
            {/if}
            Uploaded by: {version.author.username}<br>
            Zip Hash: {version.zipHash}<br>
            Uploaded at: {new Date(version.createdAt).toLocaleString()}<br>
            Last Updated at: {new Date(version.updatedAt).toLocaleString()}<br>
          </span>
        </Tooltip>
      </div>-->
    </div>
    <!-- #endregion -->
    <div>
      <Accordion collapsible={true} bind:value={accordianValue}>
        <AccordionItem value="gv" class="m-0 p-0">
          <AccordionHeader class="m-0 p-0 font-semibold">Supported Game Versions</AccordionHeader>
          <AccordionPanel class="pb-2">
            <div class="flex flex-row flex-wrap items-center text-center">
              {#each version.supportedGameVersions as supportedGameVersion, i}
                <p class="m-1 rounded-md bg-neutral-background-3 p-1 text-sm">
                  {supportedGameVersion.version}
                </p>
              {/each}
            </div>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="deps" class="m-0 p-0">
          <AccordionHeader class="m-0 p-0 font-semibold" on:click={() => {
            getDeps();
          }}>Dependencies</AccordionHeader>
          <AccordionPanel class="pb-2">
            {#if depObjsLoading}
              <div class="flex flex-row justify-center gap-2">
                <Spinner size="xs">
                  <Label>Loading...</Label>
                </Spinner>
              </div>
            {:else}
            {#if version.dependencies.length > 0}
              <div class="flex flex-row flex-wrap gap-2 pt-1">
                {#each depObjs as depObj}
                  <Link href="/mods/{depObj.mod.id}" appearance="subtle"><p class="rounded-md p-1 bg-neutral-background-3 text-sm">{depObj.mod.name} v{depObj.modVersion.modVersion}</p></Link>
                {/each}
              </div>
            {:else}
              <p>No dependencies</p>
            {/if}
            {/if}
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader class="m-0 p-0 font-semibold">More Information</AccordionHeader>
          <AccordionPanel class="pb-2">
            <p> ID: {version.id}<br>
              {#if version.dependencies.length > 0}
                Dependency IDs: {version.dependencies.join(`, `)}<br>
              {/if}
              Uploaded by: {version.author.username} (ID: ${version.author.id})<br>
              Zip Hash: {version.zipHash}<br>
              Uploaded at: {new Date(version.createdAt).toLocaleString()}<br>
              Last Updated at: {new Date(version.updatedAt).toLocaleString()}<br></p>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <!--
      <p class="font-semibold">Supports:</p>
      <div class="flex flex-row flex-wrap items-center text-center">
        {#each version.supportedGameVersions as supportedGameVersion, i}
          {#if i < 4 || shouldShowAllGV}
          <p class="m-1 rounded-md bg-neutral-background-3 p-1 text-sm">
            {supportedGameVersion.version}
          </p>
          {/if}
        {/each}
        {#if isTooManyGV}
          <Button
            class="m-0 p-0"
            appearance="transparent"
            onclick={() => {
              shouldShowAllGV = !shouldShowAllGV;
            }}
          >
            <p class="m-1 rounded-md bg-neutral-background-3 p-1 text-sm">
              {shouldShowAllGV ? "Hide" : "Show All"}
            </p>
          </Button>
        {/if}
      </div>
      -->
    </div>
  </div>
  <div class="flex flex-row justify-end gap-2">
    <Button>Edit</Button>
    <Button class=""
      onclick={() => {
        window.open(appendURL(`cdn/mod/${version.zipHash}.zip`));
      }}>
      Download ({(version.fileSize /1024 > 1024 ? `${Math.round(version.fileSize/1024/1024)}MB` : (`${Math.round(version.fileSize/1024)}KB` === `NaNKB` ? `0KB` : `${Math.round(version.fileSize/1024)}KB`))})
    </Button>
  </div>
</div>

<style>
  :global(.fui-tooltip-content) {
  max-width: 100em !important; /* why am i limited to 240px */
}

  :global(.fui-accordion-header-button) {
    margin: 0 !important;
    padding: 0 !important; 
    min-height: 0 !important;
    font-weight: 600 !important; /* font-semibold */
  }

  :global(.fui-accordion-header-expand-icon) {
    margin: 0 !important;
    padding: 0 !important; 
    width: 0 !important;
    height: 0 !important;
  }
</style>