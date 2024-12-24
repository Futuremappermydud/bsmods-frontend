<script lang="ts">
  import { Categories } from "$lib/types/Categories";
  import GamePicker from "$lib/components/ui/versions/GamePicker.svelte";
  import Tab from "$lib/components/ui/tablist/Tab.svelte";
  import TabList from "$lib/components/ui/tablist/TabList.svelte";
  import TextArea from "$lib/components/ui/textarea/TextArea.svelte";
  import DescriptionPage from "$lib/components/ui/upload/DescriptionPage.svelte";
  import {
    Button,
    Dialog,
    Divider,
    Field,
    FieldMessageError,
    Input,
  } from "@svelte-fui/core";
  import ImagePicker from "$lib/components/ui/image/ImagePicker.svelte";
  import type { ModData } from "$lib/types/Mods";
  import CategoryDropdown from "$lib/components/ui/upload/CategoryDropdown.svelte";
  import { z } from "zod";
  import { isValidSquareImage } from "$lib/utils/image";
  import { WarningFilled } from "@svelte-fui/icons";
  import axios from "axios";

  let toUpload = $state("new");

  let dataTab = $state("summary");

  let submitDialog = $state(false);

  $effect(() => {
    if (submitDialog) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  });

  // Metadata

  let selectedGame: string = $state("");
  let category: Categories | undefined = $state();
  let modName: string = $state("");
  let gitUrl: string = $state("");
  let description: string = $state("");
  let summary: string = $state("");
  let icon: string = $state("");
  let iconFile: File | undefined = $state();

  // Metadata Validation

  let modNameScheme = z
    .string()
    .min(3, "Name must contain at least 3 character(s)")
    .max(20, "Name must contain at most 20 character(s)");
  let gitUrlScheme = z
    .string()
    .min(8, "URL must contain at least 8 character(s)")
    .max(100)
    .regex(
      /^(https?:\/\/)?(www\.)?(github\.com|gitlab\.com)(\/.*)?$/,
      "Must be Github/Gitlab URL",
    )
    .regex(
      /^(.*com\/[^\/]+\/[^\/]+\/?)/,
      "Must point to a project on Github/Gitlab",
    )
    .regex(
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
      "Must be a valid URL",
    );
  let categoryScheme = z
    .string()
    .refine((value) => Object.keys(Categories).includes(value));
  let descriptionScheme = z
    .string()
    .max(200, "Description must contain at most 4096 character(s)");
  let summaryScheme = z
    .string()
    .min(10, "Summary must contain at least 10 character(s)")
    .max(200, "Summary must contain at most 200 character(s)");
  let iconScheme = z.string().refine(async (value) => {
    //check base64 image to be a square
    return await isValidSquareImage(value);
  });

  let modNameValidity = $derived(modNameScheme.safeParse(modName));
  let gitUrlValidity = $derived(gitUrlScheme.safeParse(gitUrl));
  let summaryValidity = $derived(summaryScheme.safeParse(summary));
  let iconValidity = $derived(iconScheme.safeParse(icon));

  function upload() {
    console.log("Uploading... Please pray");

    let formData = new FormData();
    formData.append("name", modName);
    formData.append("gameName", selectedGame);
    formData.append("category", category ?? "");
    formData.append("gitUrl", gitUrl);
    formData.append("description", description);
    formData.append("summary", summary);
    formData.append("icon", iconFile ?? "");

    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/api/mods/create`, formData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          if (response.data !== null) {
            console.log(response);
          }
        } else {
        }
      })
      .catch((error) => {
        console.error("An error occurred, contact a developer!");
        console.error(error);
      });
  }

  // First Version Data

  let selectedVersion = $state(null);
  let semVer = $state("");
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
    class="w-full flex flex-col gap-4 transition-opacity duration-75 ease-in items-center"
    class:opacity-0={toUpload === ""}
  >
    <Divider class="w-72 mt-2" />
    <p class="text-3xl mt-12">
      <span class="text-neutral-foreground-4">2.</span> Add Your Data
    </p>
    <div
      class="flex flex-col lg:flex-row gap-4 w-full h-[1000px] md:h-[500px] mt-6"
    >
      <div class="relative flex-[1.4] h-auto flex flex-col gap-4">
        <div class="relative shadow-4 bg-neutral-background-2 rounded-xl">
          <div
            class="absolute left-1 right-1 top-1 bottom-1 rounded-md border-dashed border-2 border-neutral-background-6 pointer-events-none"
          ></div>
          <div class="p-4">
            <div class="flex flex-col gap-2 h-min ml-auto">
              <GamePicker bind:selectedGame />
              <CategoryDropdown bind:category {categoryScheme} />
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
              <div
                class="flex flex-col md:flex-row gap-1 h-[350px] md:h-[150px]"
              >
                <ImagePicker
                  classProp="aspect-square max-w-[150px] max-h-[150px]"
                  imageProp="rounded-xl"
                  bind:avatar={icon}
                  bind:file={iconFile}
                />
                <div
                  class="flex flex-col w-full gap-2 md:pl-5 h-min items-center"
                >
                  <Field
                    label="Mod Name"
                    state={modNameValidity.success ? "success" : "error"}
                  >
                    <Input
                      bind:value={modName}
                      ariaInvalid={!modNameValidity.success}
                    />
                    <FieldMessageError open={!modNameValidity.success}
                      >{modNameValidity.error?.format()
                        ._errors}</FieldMessageError
                    >
                  </Field>
                  <Field
                    label="Git URL"
                    state={gitUrlValidity.success ? "success" : "error"}
                  >
                    <Input
                      bind:value={gitUrl}
                      ariaInvalid={!gitUrlValidity.success}
                    />
                    <FieldMessageError open={!gitUrlValidity.success}
                      >{gitUrlValidity.error?.format()
                        ._errors[0]}</FieldMessageError
                    >
                  </Field>
                </div>
              </div>
              <Field
                label="Summary"
                state={summaryValidity.success ? "success" : "error"}
              >
                <TextArea
                  componentClass="!h-full w-full"
                  placeholder="200 characters on why your mod is the best"
                  bind:value={summary}
                  ariaInvalid={!summaryValidity.success}
                />
                <FieldMessageError open={!summaryValidity.success}
                  >{summaryValidity.error?.format()
                    ._errors[0]}</FieldMessageError
                >
              </Field>
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
              <Tab value="checklist" disabled={true}>Checklist WIP</Tab>
            </TabList>
          </div>
          <div
            class="seperator w-2 float-left h-full border-dashed border-l-2 border-neutral-background-6 my-1"
          ></div>
          <div
            class="flex-[5.5] mb-2 mt-2 mr-2 block absolute h-auto bottom-0 top-0 right-0 left-36"
          >
            {#if dataTab == "summary"}
              <DescriptionPage bind:text={description} {descriptionScheme} />
            {/if}
          </div>
        </div>
      </div>
    </div>
    <Button
      class="shadow-8 mb-64"
      onclick={() => {
        submitDialog = true;
      }}
    >
      ✔ I'm Done!
    </Button>
    <Dialog.Root bind:open={submitDialog} type="modal">
      <Dialog.Header>Ready to Create?</Dialog.Header>

      <Dialog.Body class="h-40">
        <div
          class="h-fit p-4 relative shadow-4 bg-neutral-background-2 rounded-xl"
          class:opacity-0={icon !== "" || !submitDialog}
        >
          <div
            class="absolute left-1 right-1 top-1 bottom-1 rounded-md border-dashed border-2 border-palette-yellow-background-3 border-opacity-100 pointer-events-none"
          ></div>
          <div class="h-6 flex flex-row gap-2 content-center">
            <svg class="h-6" viewBox="0 0 20 20">
              <WarningFilled />
            </svg>
            <p class="">Mod Icon</p>
          </div>
          <p class="text-left text-xs">
            If you do not provide an icon, one will be provided for you based on
            your game!
          </p>
        </div>
        <p>
          Clicking submit will create a new mod with the info you provided, you
          can edit this later by going to your mod page. The following steps
          will bring you to upload the first binary of your mod!
        </p>
      </Dialog.Body>

      <Dialog.Actions class="justify-end">
        <Button
          onclick={() => {
            submitDialog = false;
          }}>Cancel</Button
        >
        <Button
          onclick={() => {
            upload();
          }}>Ok</Button
        >
      </Dialog.Actions>
    </Dialog.Root>
  </div>
  <div
    class="w-full flex flex-col gap-4 mt-8 transition-opacity duration-75 ease-in items-center"
    class:opacity-0={!submitDialog}
  >
    <Divider class="w-72 mt-2" />
    <p class="text-3xl mt-12">
      <span class="text-neutral-foreground-4">3.</span> Make Your First Upload!
    </p>
  </div>
</div>

<style>
  .seperator {
    height: calc(100% - 32px);
  }

  :global(.fui-field) {
    width: 100%;
    height: 100%;
    display: flex !important;
    flex-direction: column;
  }

  :global(.fui-field > label) {
    margin-right: auto;
  }
</style>
