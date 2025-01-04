<script lang="ts">
  import type {
    IndividualModData,
    Mod,
    ModData,
    Mods,
    ModVersion,
    SupportedGameVersion,
  } from "$lib/types/Mods";
  import axios from "axios";
  import type { PageData } from "./$types";
  import { appendURL } from "$lib/utils/url";
  import {
    Button,
    Dialog,
    Field,
    FieldMessageError,
    Input,
    Spinner,
  } from "@svelte-fui/core";
  import ModCardBase from "$lib/components/ui/mods/ModCardBase.svelte";
  import GameVersionPicker from "$lib/components/ui/filtering/GameVersionPicker.svelte";
  import { Platform } from "$lib/types/Platform";
  import { Validator } from "$lib/types/Validator";
  import TabList from "$lib/components/ui/tablist/TabList.svelte";
  import Tab from "$lib/components/ui/tablist/Tab.svelte";
  import { z } from "zod";
  import type { Versions } from "$lib/types/Versions";

  let { data }: { data: PageData } = $props();

  let mod: IndividualModData | undefined = $state();

  interface Dependency {
    name: string;
    id: number;
    version: string;
  }

  //UI State
  let allGameVersions: Versions = $state({ versions: [] });
  let tempSelectedVersion = $state("");
  let submitDialog = $state(false);
  let dependencyState = $state("raw");
  let tempRawDepName = $state("");
  let tempRawDepVersion = $state("");
  let tempRawDepAllVersions: ModVersion[] = $state([]);
  let rawDeps: Dependency[] = $state([]);

  async function getMods() {
    return await axios
      .get(appendURL(`api/mods/${data.id}`), { withCredentials: true })
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          if (response.data !== null) {
            mod = response.data.mod;
            return mod;
          }
        }
      })
      .catch((error) => {
        console.error("An error occurred, contact a developer!");
        console.error(error);
      });
  }

  //Mods
  let allSelectedMods: Mod[] = $state([]);

  let loadingTempRawDepVersions = $state(false);
  function updateRawDepVersions(name: string) {
    let mod = allSelectedMods.find((m) => m.name === name);
    if (mod) {
      tempRawDepAllVersions = [];
      loadingTempRawDepVersions = true;
      axios
        .get(appendURL(`api/mods/${mod.id}`), { withCredentials: true })
        .then((response) => {
          if (response.status === 302 || response.status === 200) {
            if (response.data !== null) {
              tempRawDepAllVersions = response.data.mod
                .versions as ModVersion[];
            }
          }
          loadingTempRawDepVersions = false;
        })
        .catch((error) => {
          console.error("An error occurred, contact a developer!");
          console.error(error);
          loadingTempRawDepVersions = false;
        });
    }
  }

  $effect(() => {
    updateRawDepVersions(tempRawDepName);
  });

  function addVersionToMods(v: string) {
    axios
      .get(
        appendURL(
          `api/mods?gameName=${mod?.info.gameName}&gameVersion=${v}&visibility=verified&platform=universalpc`,
        ),
        { withCredentials: false },
      )
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          if (response.data !== null) {
            let mods: Mods = response.data;

            for (let m of mods.mods.map((x) => x.mod)) {
              allSelectedMods.push(m);
            }

            allSelectedMods = allSelectedMods.filter((value, index, self) => {
              return self.findIndex((v) => v.id === value.id) === index;
            });
          }
        }
      })
      .catch((error) => {
        console.error("An error occurred, contact a developer!");
        console.error(error);
      });
  }

  function clearMods() {
    allSelectedMods = [];
  }

  //Upload data
  let supportedGameVersions: string[] = $state([]);
  let modVersion: string = $state("");
  let modDependencies: number[] = $state([]);
  let platform: Platform = Platform.UniversalPC;

  //Validation
  let modNameScheme = Validator.zUploadModVersion.pick({ modVersion: true });
  let modNameValidity = $derived.by(() => {
    return modNameScheme.safeParse({
      modVersion: modVersion,
    });
  });

  let dependencyNameScheme = z.string().refine((v) => {
    if (allSelectedMods.length === 0) return false;
    return allSelectedMods.some((m) => m.name === v);
  }, "Must be a valid Mod name!");
  let dependencyNameValidity = $derived.by(() => {
    return dependencyNameScheme.safeParse(tempRawDepName);
  });

  let dependencyVersionScheme = z
    .string()
    .refine(
      (v) => {
        if (tempRawDepAllVersions.length === 0) return false;
        return tempRawDepAllVersions.some((m) => m.modVersion === v);
      },
      (v) => ({
        message: `Must be a valid version for ${tempRawDepName}!`,
      }),
    )
    .refine((v) => {
      if (tempRawDepAllVersions.length === 0) return false;
      let version = tempRawDepAllVersions.find((m) => m.modVersion === v);
      return supportedGameVersions.every((g) =>
        version?.supportedGameVersions.some((s) => s.version === g),
      );
    }, "Must support all selected game versions!");
  let dependencyVersionValidity = $derived.by(() => {
    return dependencyVersionScheme.safeParse(tempRawDepVersion);
  });

  //Actions
  function addVersion() {
    supportedGameVersions.push(tempSelectedVersion);

    addVersionToMods(tempSelectedVersion);

    tempSelectedVersion = "";
  }

  function addRawDependency() {
    let mod = allSelectedMods.find((m) => m.name === tempRawDepName);
    rawDeps.push({
      name: tempRawDepName,
      id: mod?.id ?? -1,
      version: tempRawDepVersion,
    });
    tempRawDepName = "";
    tempRawDepVersion = "";
  }

  function upload() {
    console.log("Uploading... pray");

    let formData = new FormData();

    supportedGameVersions
      .map((v) => allGameVersions.versions.find((g) => g.version === v)?.id)
      .filter((v) => !!v)
      .forEach((value, index) => {
        formData.append(
          `supportedGameVersionIds[${index}]`,
          value?.toString() ?? "",
        );
      });

    rawDeps
      .map((d) => d.id)
      .forEach((value, index) => {
        formData.append(`dependencies[${index}]`, value?.toString() ?? "");
      });

    formData.append("modVersion", modVersion);
    formData.append("platform", platform.toString());

    axios
      .post(appendURL(`api/mods/${mod?.info.id}/upload`), formData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          if (response.data !== null) {
            console.log(response);
          }
        }
      })
      .catch((error) => {
        console.error("An error occurred, contact a developer!");
        console.error(error);
      });
  }
</script>

<div class="flex flex-col gap-4">
  {#await getMods()}
    <div class="flex h-28 flex-row items-center justify-center gap-4">
      <Spinner />
      <p>Loading...</p>
    </div>
  {:then}
    {#if !mod}
      <div class="flex h-28 flex-row items-center justify-center gap-4">
        <p>No mod found!</p>
      </div>
    {:else}
      <ModCardBase
        mod={mod?.info}
        author={mod?.info.authors}
        smallCorners={true}
      />
    {/if}
  {/await}
  <div class="mx-10 flex flex-row gap-4">
    <div class="flex flex-col gap-4">
      <div
        class="items-left flex flex-col gap-2 rounded-xl bg-neutral-background-2 p-4 shadow-4"
      >
        <h1 class="mx-auto text-lg font-semibold">Supported Game Versions</h1>
        {#each supportedGameVersions as version}
          <div
            class="flex h-fit w-auto flex-row items-center gap-2 rounded bg-neutral-background-3 p-2 shadow-2"
          >
            <p>{version}</p>
            <Button
              size="sm"
              onclick={() => {
                supportedGameVersions.splice(
                  supportedGameVersions.indexOf(version),
                  1,
                );
                clearMods();
                for (let v of supportedGameVersions) {
                  addVersionToMods(v);
                }
              }}>Remove</Button
            >
          </div>
        {/each}
        <div class="flex w-auto flex-1 flex-row gap-4">
          <GameVersionPicker
            bind:allVersions={allGameVersions}
            disabled={rawDeps.length > 0}
            removeLabel={true}
            selectedGame={mod?.info.gameName}
            bind:selectedVersion={tempSelectedVersion}
            required={supportedGameVersions.length === 0}
          />
          <Button
            class="fds-button"
            onclick={addVersion}
            disabled={supportedGameVersions.includes(tempSelectedVersion) ||
              tempSelectedVersion === "" ||
              rawDeps.length > 0}>Add</Button
          >
        </div>
      </div>
      <div
        class="flex flex-1 flex-col items-center gap-2 rounded-xl bg-neutral-background-2 p-4 shadow-4"
      >
        <h1 class="mx-auto text-lg font-semibold">Mod Version</h1>
        <Field state={modNameValidity.success ? "success" : "error"}>
          <Input
            bind:value={modVersion}
            ariaInvalid={!modNameValidity.success}
          />
          <FieldMessageError open={!modNameValidity.success}
            >{modNameValidity.error?.format().modVersion
              ?._errors[0]}</FieldMessageError
          >
        </Field>
      </div>
      <div
        class="flex flex-1 flex-col items-center gap-2 rounded-xl bg-neutral-background-2 p-4 shadow-4"
      >
        <h1 class="mx-auto text-lg font-semibold">File Upload</h1>
        <input type="file" />
      </div>
    </div>
    <div
      class="flex flex-1 flex-col items-center gap-2 rounded-xl bg-neutral-background-2 p-4 pt-0 shadow-4"
    >
      <TabList bind:value={dependencyState} layout="horizontal">
        <Tab value="rich" disabled={true}>Rich (WIP)</Tab>
        <Tab value="raw">Raw</Tab>
      </TabList>

      {#if dependencyState === "raw"}
        <h1 class="mx-auto text-lg font-semibold">Dependencies</h1>
        <div class="flex min-h-32 flex-col gap-4">
          {#each rawDeps as dep}
            <div
              class="flex h-fit w-auto flex-row items-center gap-2 rounded bg-neutral-background-3 p-2 shadow-2"
            >
              <p>{dep.name} - {dep.version}</p>
              <Button
                size="sm"
                onclick={() => {
                  rawDeps.splice(rawDeps.indexOf(dep), 1);
                }}>Remove</Button
              >
            </div>
          {/each}
        </div>
        <div class="flex h-fit w-auto flex-row gap-4">
          <Field
            label="Mod Name"
            state={dependencyNameValidity.success ? "success" : "error"}
          >
            <Input
              bind:value={tempRawDepName}
              ariaInvalid={!dependencyNameValidity.success}
              disabled={supportedGameVersions.length === 0}
            />
            <FieldMessageError open={!dependencyNameValidity.success}
              >{dependencyNameValidity.error?.format()
                ._errors[0]}</FieldMessageError
            >
          </Field>
          <Field
            label="Mod Version"
            state={dependencyVersionValidity.success ? "success" : "error"}
          >
            <Input
              bind:value={tempRawDepVersion}
              ariaInvalid={!dependencyVersionValidity.success &&
                dependencyNameValidity.success}
              disabled={tempRawDepAllVersions.length === 0 ||
                loadingTempRawDepVersions}
              class="w-56"
            />
            <FieldMessageError
              open={!dependencyVersionValidity.success &&
                dependencyNameValidity.success}
              >{dependencyVersionValidity.error?.format()
                ._errors[0]}</FieldMessageError
            >
          </Field>
          <Button
            class="fds-button !mt-[26px] h-fit"
            onclick={addRawDependency}
            disabled={tempRawDepName === "" ||
              tempRawDepVersion === "" ||
              supportedGameVersions.length === 0 ||
              !dependencyNameValidity.success ||
              !dependencyVersionValidity.success ||
              rawDeps.some((v) => v.name === tempRawDepName)}>Add</Button
          >
        </div>
      {/if}
    </div>
  </div>
  <Button
    class="w-fit self-center shadow-8"
    onclick={() => {
      submitDialog = true;
    }}
  >
    ✔ I'm Done!
  </Button>
  <Dialog.Root bind:open={submitDialog} type="modal">
    <Dialog.Header>Ready to Upload?</Dialog.Header>

    <Dialog.Body class="h-40">
      <p>
        Clicking "Ok" will upload a new version of your mod as private, this can
        be edited later from your mod page on the version card for this
        submission. Once this version is uploaded you will need to go to your
        mod page and click "Submit" to mark the version as ready for
        verification,
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

<style>
  :global(.fui-field) {
    height: min-content;
  }
</style>
