<script lang="ts">
  import type { Mod, ModVersion } from "$lib/types/Mods";
  import { Status } from "$lib/types/Status";
  import { appendURL } from "$lib/utils/url";
  import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, Button, Label, Link, Spinner, Dropdown, InputSkin, Tooltip } from "@svelte-fui/core";
  import { ArrowDownloadRegular, DismissRegular, InfoFilled, LinkRegular, WarningFilled } from "@svelte-fui/icons";
  import { numify } from "numify";
  import axios from "axios";
    import type { DisplayApprovalModalFunction } from "$lib/types/Approval";
    import { onMount, tick } from "svelte";

  let {
    id,
    version,
    mod,
    isAuthor,
    isApprover,
    displayApprovalModal,
  }: { id?:string, version: ModVersion; mod: Mod; isAuthor: boolean; isApprover: boolean, displayApprovalModal: DisplayApprovalModalFunction } =
    $props();

  onMount(async () => {
    await tick();
    if (id) {
      if (window.location.hash === `#${id}`) {
        let e = document.getElementById(document.location.hash.slice(1));
        if (e) {
          e.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  });

  let accordionValue = $state<string>('gv');

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

  let isEditMode = $state(false);
  let editVersionToAdd: any = $state(null);
  let gameVersions: any[] = $state([]);
  let responseMessage = $state("");
  let responseMessageIsGood = $state(false);
  function toggleEditMode() {
    isEditMode = !isEditMode;
    responseMessage = "";
    responseMessageIsGood = false;
    if (gameVersions.length === 0) {
      axios
        .get(appendURL(`api/versions`))
        .then((response) => {
          if (response.status === 200 && response.data && response.data.versions) {
            gameVersions = response.data.versions as any[];
          }
        });
    }
  }

  function updateVersions(add:boolean, id:number) {
    if (add) {
      if (editVersionToAdd) {
        let versionToAdd = gameVersions.find((v) => v.id === id);
        if (!versionToAdd) return;
        if (versionToAdd.id === version.id) return;
        if (version.supportedGameVersions.find((v) => v.id === versionToAdd.id)) return;
        version.supportedGameVersions.push(editVersionToAdd);
        editVersionToAdd = null;
      }
    } else {
      version.supportedGameVersions = version.supportedGameVersions.filter((v) => v.id !== id);
    }
  }

  function submitEdit() {
    axios
      .patch(appendURL(`api/modVersion/${version.id}`), {
          supportedGameVersionIds: version.supportedGameVersions.map((v) => v.id),
        }, {
          withCredentials: true,
      })
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          if (response.data !== null) {
            //window.location.reload();
            responseMessage = response.data.message;
            responseMessageIsGood = true;
            isEditMode = false;
          }
        }
      })
      .catch((error) => {
        console.error("An error occurred, contact a developer!");
        console.error(error);
        responseMessageIsGood = false;
        if (error.response) {
          if (error.response.data && error.response.data.message) {
            responseMessage = error.response.data.message;
          }
        } else {
          responseMessage = "An unknown error occurred.";
        }
      });
  }
</script>

<div
  class="relative flex flex-col gap-1 rounded-xl bg-neutral-background-2 p-4 shadow-4 {window.location.hash === `#${id}` ? `border-2 border-blue-500` : ``}"
  id={id}
>
  <!-- #region top bar-->
  <div class="flex flex-col gap-2">
    <div class="flex flex-row items-center gap-2">
      <!-- Redundant, yes, but I think in this card format, it looks much better -->
      <p class="flex-1 text-lg font-semibold">
        {mod.name} v{version.modVersion}
      </p>

      <Tooltip content="Copy Link">
        <Button class="p-1 m-0" appearance="subtle" onclick={() => {
          navigator.clipboard.writeText(appendURL(`mod/${mod.id}#${id}`));
        }}>
          <svg viewBox="0 0 20 20" class="h-5 w-5 text-neutral-foreground-2 md:w-4">
            <LinkRegular />
          </svg>
        </Button>
      </Tooltip>
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
      <Accordion collapsible={true} bind:value={accordionValue}>
        <AccordionItem value="gv" class="m-0 p-0">
          <AccordionHeader class="m-0 p-0 font-semibold">{accordionValue == `gv` ? `-` : `+`} Supported Game Versions</AccordionHeader>
          <AccordionPanel class="pb-2">
            <div class="flex flex-row flex-wrap items-center text-center">
              {#each version.supportedGameVersions as supportedGameVersion, i}
                <div class="m-1 rounded-md bg-neutral-background-3 p-1 text-sm">
                  <p>
                    {supportedGameVersion.version} 
                    {#if isEditMode}
                      <Button class="p-0 m-0 w-auto h-auto text-sm" appearance="transparent" on:click={() => {
                        updateVersions(false, supportedGameVersion.id);
                      }}>
                        <svg viewBox="0 0 20 20" class="h-4 w-4 text-neutral-foreground-2 md:w-4">
                          <DismissRegular />
                        </svg>
                      </Button>
                    {/if}
                  </p>
                </div>
              {/each}
            </div>
            {#if isEditMode}
            <!-- ive lost patience, its just gonna have to look weird.-->
            <div class="flex flex-row justify-center gap-2 pt-1">
            <Dropdown.Root bind:value={editVersionToAdd}>
              <Dropdown.Trigger let:data>
                <InputSkin class="min-w-[100px]">
                  {#if data}
                    <span>{data.version}</span>
                  {:else}
                    <span>Select a version</span>
                  {/if}
                  <Dropdown.Arrow />
                </InputSkin>
              </Dropdown.Trigger>
              <Dropdown.Menu>
                {#each gameVersions as version}
                  <Dropdown.Item value={version} data={version}>{version.version}</Dropdown.Item>
                {/each}
              </Dropdown.Menu>
            </Dropdown.Root>
            <Button on:click={() => {
              updateVersions(true, editVersionToAdd.id);
              editVersionToAdd = null;
            }}>Add</Button>
            </div>
            {/if}
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="deps" class="m-0 p-0">
          <AccordionHeader class="m-0 p-0 font-semibold" on:click={() => {
            getDeps();
          }}>{accordionValue == `deps` ? `-` : `+`} Dependencies</AccordionHeader>
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
                    <Link href="/mods/{depObj.mod.id}" appearance="subtle"><p class="rounded-md p-1 {depObj.modVersion.status !== Status.Verified || depObj.mod.status !== Status.Verified ? `bg-orange-950` : `bg-neutral-background-3`} text-sm">{depObj.mod.name} v{depObj.modVersion.modVersion}</p></Link>
                  {/each}
                </div>
              {:else}
                <p>No dependencies</p>
              {/if}
              {#if isEditMode}
                <p>Dependency editing pending...</p>
              {/if}
            {/if}
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="info">
          <AccordionHeader class="m-0 p-0 font-semibold">{accordionValue == `info` ? `-` : `+`} More Information</AccordionHeader>
          <AccordionPanel class="pb-2">
            <div class="flex flex-row flex-wrap gap-1 pt-1">
              <p class="p-1 bg-neutral-background-3 rounded-md">ID | {version.id}</p>
              {#if version.dependencies.length > 0}
                <p class="p-1 bg-neutral-background-3 rounded-md">Dependency IDs | {version.dependencies.join(`, `)}</p>
              {/if}
              <p class="p-1 bg-neutral-background-3 rounded-md">Uploaded by | {version.author.username} (ID: {version.author.id})</p>
              <p class="p-1 bg-neutral-background-3 rounded-md">Zip Hash | {version.zipHash}</p>
              <p class="p-1 bg-neutral-background-3 rounded-md">Upload Date | {new Date(version.createdAt).toLocaleString()}</p>
              <p class="p-1 bg-neutral-background-3 rounded-md">Last Updated | {new Date(version.updatedAt).toLocaleString()}</p>
            </div>
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
  <div class="flex flex-col gap-2 pt-2">
    {#if responseMessage !== ""}
      <p class={responseMessageIsGood ? `text-green-500` : `text-red-500`}>{responseMessage}</p>
    {/if}
  </div>
  <div class="flex flex-row justify-end gap-2">
    {#if isApprover}
      <Button on:click={() => {
        displayApprovalModal(`modVersion`, `Approve ${mod.name} v${version.modVersion}`, ``, mod, version.id, () => {});
      }}>Approval</Button>
    {/if}
    {#if isApprover || isAuthor}
      <Button on:click={toggleEditMode}>Edit</Button>
    {/if}
    {#if isEditMode}
      <Button on:click={submitEdit}>Submit Edit</Button>
    {:else}
    <Button class=""
      onclick={() => {
        window.open(appendURL(`cdn/mod/${version.zipHash}.zip`));
      }}>
      Download ({(version.fileSize /1024 > 1024 ? `${Math.round(version.fileSize/1024/1024)}MB` : (`${Math.round(version.fileSize/1024)}KB` === `NaNKB` ? `0KB` : `${Math.round(version.fileSize/1024)}KB`))})
    </Button>
    {/if}
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