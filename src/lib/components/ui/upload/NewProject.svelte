<script lang="ts">
  import { Categories } from "$lib/types/Categories";
  import GamePicker from "$lib/components/ui/filtering/GamePicker.svelte";
  import Tab from "$lib/components/ui/tablist/Tab.svelte";
  import TabList from "$lib/components/ui/tablist/TabList.svelte";
  import TextArea from "$lib/components/ui/textarea/TextArea.svelte";
  import DescriptionPage from "$lib/components/ui/upload/DescriptionPage.svelte";
  import {
    Button,
    Dialog,
    Field,
    FieldMessageError,
    Input,
  } from "@svelte-fui/core";
  import ImagePicker from "$lib/components/ui/image/ImagePicker.svelte";
  import CategoryDropdown from "$lib/components/ui/upload/CategoryDropdown.svelte";
  import { z } from "zod";
  import { isValidSquareImage } from "$lib/utils/image";
  import axios from "axios";
  import { appendURL } from "$lib/utils/url";

  let dataTab = $state("description");

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
    .max(4096, "Description must contain at most 4096 character(s)");
  let summaryScheme = z
    .string()
    .min(10, "Summary must contain at least 10 character(s)")
    .max(200, "Summary must contain at most 200 character(s)");
  let iconScheme = z
    .string()
    .nonempty("Icon must be provided")
    .refine(async (value) => {
      //check base64 image to be a square
      return await isValidSquareImage(value);
    }, "Icon must be square");

  let modNameValidity = $derived(modNameScheme.safeParse(modName));
  let gitUrlValidity = $derived(gitUrlScheme.safeParse(gitUrl));
  let summaryValidity = $derived(summaryScheme.safeParse(summary));

  function upload() {
    console.log("Uploading... Please pray");

    let formData = new FormData();
    formData.append("name", modName);
    formData.append("gameName", selectedGame);
    formData.append("category", category?.toString() ?? "");
    formData.append("gitUrl", gitUrl);
    formData.append("description", description);
    formData.append("summary", summary);
    iconFile ? formData.append("icon", iconFile) : undefined;

    axios
      .post(appendURL(`api/mods/create`), formData, {
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
</script>

<div
  class="mt-8 flex w-full flex-col items-center gap-4 transition-opacity duration-75 ease-in"
>
  <div
    class="mt-6 flex h-[1000px] w-full flex-col gap-4 md:h-[500px] lg:flex-row"
  >
    <div class="relative flex h-auto flex-[1.4] flex-col gap-4">
      <div class="relative rounded-xl bg-neutral-background-2 shadow-4">
        <div
          class="pointer-events-none absolute bottom-1 left-1 right-1 top-1 rounded-md border-2 border-dashed border-neutral-background-6"
        ></div>
        <div class="p-4">
          <div class="ml-auto flex h-min flex-col gap-2">
            <GamePicker bind:selectedGame required={true} />
            <CategoryDropdown bind:category {categoryScheme} />
          </div>
        </div>
      </div>
      <div
        class="relative flex flex-[2.5] flex-col gap-4 rounded-xl bg-neutral-background-2 shadow-4"
      >
        <div
          class="pointer-events-none absolute bottom-1 left-1 right-1 top-1 rounded-md border-2 border-dashed border-neutral-background-6"
        ></div>
        <div class="h-full p-4">
          <div class="flex h-full flex-col gap-4">
            <div class="flex h-[350px] flex-row gap-1 md:h-[160px] md:flex-row">
              <div class="mb-4 flex flex-col gap-2">
                <p class="min-w-[120px]">Icon (8MB Max)</p>
                <ImagePicker
                  classProp="aspect-square max-w-[160px] max-h-[160px]"
                  imageProp="rounded-xl"
                  required={false}
                  bind:avatar={icon}
                  bind:file={iconFile}
                  {iconScheme}
                />
              </div>
              <div
                class="flex h-min w-full flex-col items-center gap-2 md:pl-5"
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
                >{summaryValidity.error?.format()._errors[0]}</FieldMessageError
              >
            </Field>
          </div>
        </div>
      </div>
    </div>
    <div
      class="relative h-full flex-[1.75] rounded-xl bg-neutral-background-2 shadow-4"
    >
      <div
        class="pointer-events-none absolute bottom-1 left-1 right-1 top-1 float-left rounded-md border-2 border-dashed border-neutral-background-6"
      ></div>
      <div class="flex h-full flex-row items-center pb-4 pt-4">
        <div class="ml-4 w-28">
          <TabList disabled={false} layout="vertical" bind:value={dataTab}>
            <Tab value="description">Description</Tab>
            <Tab value="checklist" disabled={true}>Checklist WIP</Tab>
          </TabList>
        </div>
        <div
          class="seperator float-left my-1 h-full w-2 border-l-2 border-dashed border-neutral-background-6"
        ></div>
        <div
          class="absolute bottom-0 left-36 right-0 top-0 mb-2 mr-2 mt-2 block h-auto flex-[5.5]"
        >
          {#if dataTab == "description"}
            <DescriptionPage bind:text={description} {descriptionScheme} />
          {/if}
        </div>
      </div>
    </div>
  </div>
  <Button
    class="mb-64 shadow-8"
    onclick={() => {
      submitDialog = true;
    }}
  >
    ✔ I'm Done!
  </Button>
  <Dialog.Root bind:open={submitDialog} type="modal">
    <Dialog.Header>Ready to Create?</Dialog.Header>

    <Dialog.Body class="h-40">
      <p>
        Clicking "Ok" will create a new mod with the info you provided, you can
        edit this later by going to your mod page. After creating you will be
        brought to your mod's page.
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
