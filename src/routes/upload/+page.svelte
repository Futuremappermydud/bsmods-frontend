<script lang="ts">
  import VersionPicker from "$lib/components/ui/versions/VersionPicker.svelte";
  import Tab from "$lib/components/ui/tablist/Tab.svelte";
  import TabList from "$lib/components/ui/tablist/TabList.svelte";
  import TextArea from "$lib/components/ui/textarea/TextArea.svelte";
  import SummaryPage from "$lib/components/ui/upload/SummaryPage.svelte";
  import { Button, Divider, Field, Icon, Input } from "@svelte-fui/core";
  import ImagePicker from "$lib/components/ui/image/ImagePicker.svelte";
  import { WarningFilled } from "@svelte-fui/icons";

  let toUpload = $state("");

  let dataTab = $state("summary");

  let selectedGame = $state(null);
  let selectedVersion = $state(null);
</script>

<div class="flex gap-4 flex-col text-center items-center">
  <p
    class="text-lg font-semibold text-neutral-foreground-4 absolute top-16 left-4"
  >
    Upload Mod
  </p>
  <p class="text-3xl mt-16">1. Pick Your Upload Method</p>
  <TabList disabled={false} layout="horizontal" bind:value={toUpload}>
    <Tab value="existing">Update an <i>existing</i> Mod</Tab>
    <Tab value="new">Create a <i>new</i> Mod</Tab>
  </TabList>
  <div
    class="w-full flex flex-col transition-opacity duration-75 ease-in items-center"
    class:opacity-0={toUpload === ""}
  >
    <Divider class="w-72 mt-2" />
    <p class="text-3xl mt-12">
      <span class="text-neutral-foreground-4">2.</span> Add Your Data
    </p>
    <div class="flex flex-row gap-4 w-full h-[450px] mt-6">
      <div class="relative flex-1 h-auto flex flex-col gap-4">
        <div class="relative shadow-4 bg-neutral-background-2 rounded-xl">
          <div
            class="absolute left-1 right-1 top-1 bottom-1 rounded-md border-dashed border-2 border-neutral-background-6 pointer-events-none"
          ></div>
          <div class="p-4">
            <div class="flex flex-col gap-2 h-min ml-auto">
              <VersionPicker bind:selectedGame bind:selectedVersion />
            </div>
          </div>
        </div>
        <div
          class="flex-[2.5] relative shadow-4 bg-neutral-background-2 rounded-xl"
        >
          <div
            class="absolute left-1 right-1 top-1 bottom-1 rounded-md border-dashed border-2 border-neutral-background-6 pointer-events-none"
          ></div>
          <div class="p-4 h-full">
            <div class="flex flex-col gap-4 h-full">
              <div class="flex flex-row gap-1 h-[72px]">
                <ImagePicker classProp="aspect-square" imageProp="rounded-xl" />
                <div
                  class="flex flex-col w-full gap-2 h-min ml-auto items-center"
                >
                  <Field label="Mod Name" orientation="horizontal">
                    <Input size="sm" />
                  </Field>
                  <Field label="SemVer" orientation="horizontal">
                    <Input size="sm" />
                  </Field>
                </div>
              </div>
              <TextArea
                componentClass="!h-full w-full"
                placeholder="2-3 sentences on why your mod is the best"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        class="relative h-full flex-[1.75] shadow-4 bg-neutral-background-2 rounded-xl"
      >
        <div
          class="absolute float-left left-1 right-1 top-1 bottom-1 rounded-md border-dashed border-2 border-neutral-background-6 pointer-events-none"
        ></div>
        <div class="flex flex-row h-full items-center">
          <div class="ml-4 w-28">
            <TabList disabled={false} layout="vertical" bind:value={dataTab}>
              <Tab value="summary">Summary</Tab>
              <Tab
                value="dependencies"
                disabled={!(selectedGame && selectedVersion)}>Dependencies</Tab
              >
              <Tab value="checklist">Checklist</Tab>
              <Tab value="upload" disabled={!(selectedGame && selectedVersion)}
                >Upload</Tab
              >
            </TabList>
          </div>
          <div
            class="seperator w-2 float-left h-full border-dashed border-l-2 border-neutral-background-6 my-1"
          ></div>
          <div
            class="flex-[5.5] mb-2 mt-2 mr-2 block absolute h-auto bottom-0 top-0 right-0 left-36"
          >
            {#if dataTab == "summary"}
              <SummaryPage />
            {/if}
            {#if dataTab == "dependencies"}
              <div class="flex flex-col gap-4">
                <Input size="sm" placeholder="Dependencies" />
              </div>
            {/if}
            {#if dataTab == "upload"}
              <div class="flex flex-col gap-4">
                <Input size="sm" placeholder="Upload" />
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
    <div
      class="mt-4 h-5 w-5 rounded-xl transition-colors hover:bg-brand-foreground-link-hover shadow-sm shadow-brand-foreground-link"
    ></div>
  </div>
</div>

<style>
  .seperator {
    height: calc(100% - 32px);
  }

  :global(.fui-label) {
    align-self: center;
  }
</style>
