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
    Dropdown,
    InputSkin,
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    Icon,
    Label,
    Checkbox,
  } from "@svelte-fui/core";
  import ModCardBase from "$lib/components/ui/mods/ModCardBase.svelte";
  import GameVersionPicker from "$lib/components/ui/filtering/GameVersionPicker.svelte";
  import { Platform } from "$lib/types/Platform";
  import { Validator } from "$lib/types/Validator";
  import TabList from "$lib/components/ui/tablist/TabList.svelte";
  import Tab from "$lib/components/ui/tablist/Tab.svelte";
  import { z } from "zod";
  import type { Versions } from "$lib/types/Versions";
  import { coerce } from "semver";
  import { env } from "$env/dynamic/public";
  import { checkUserAnyGame, UserRoles } from "$lib/types/UserRoles";
  import type { AuthedUser } from "$lib/types/AuthedUser";
    import { ChevronDoubleDownFilled } from "@svelte-fui/icons";
    import { Status } from "$lib/types/Status";

  let { data, text = $bindable() }: { userData: AuthedUser, data: PageData; text: string; } = $props();

  let userData: AuthedUser = {
    hasAttempted: false,
    authenticated: false,
    username: "Guest",
    userId: -1,
    roles: null,
  };

  try {
    axios
      .get(appendURL("api/auth"), {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          if (response.data !== null) {
          let data = response.data;
          userData = {
            hasAttempted: true,
            authenticated: true,
            username: data.user.username,
            userId: data.user.id,
            roles: data.user.roles,
          };
          }
        }
      })
      .catch((error) => {
        userData = {
          hasAttempted: true,
          authenticated: false,
          username: "Guest",
          userId: -1,
          roles: null,
        };
      });
  } catch (error) {
    userData = {
      hasAttempted: true,
      authenticated: false,
      username: "Guest",
      userId: -1,
      roles: null,
    };
  }

  let mod: IndividualModData | undefined = $state();
  let selectedVersion:ModVersion | undefined = $state();

  interface Dependency {
    name: string;
    id: number;
    version: string;
    versionId: number;
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
  let tempRawAllowedVersions: ModVersion[] = $state([]);
  let alsoSubmitForVerification = $state(false);

  let errorObj:any = $state(null);

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

          if (tempRawDepAllVersions.length === 0) {
            console.error("No versions found for mod!");
          } else {
            tempRawAllowedVersions = tempRawDepAllVersions.filter((v) => {
              let valid = dependencyVersionScheme.safeParse(v.modVersion);
              if (v.status === Status.Removed) {
                return false;
              }
              return valid.success;
            });
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
          `api/mods?gameName=${mod?.info.gameName}&gameVersion=${v}&status=unverified&platform=universalpc`,
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
  let modZip: File | undefined = $state();

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
      // if dependencies are not empty, check if the version supports all selected game versions
      if (tempRawDepAllVersions.length === 0) return false;
      // get the version object for the selected version
      let version = tempRawDepAllVersions.find((m) => m.modVersion === v);
      //return supportedGameVersions.every((g) =>
      //  version?.supportedGameVersions.some((s) => s.version === g),
      //);
      let errorSortingVersions = false;
      // would use .sort() but it mutates the array, and svelte shits itself if that happens
      let earliestGameVersion = supportedGameVersions.toSorted((a, b) => {
        let asv = coerce(a);
        let bsv = coerce(b);
        if (asv && bsv) {
          return asv.compare(bsv);
        } else {
          if (errorSortingVersions) {
            console.error(
              `Unable to coerce Game Versions. Game Version dependency resolution might break.`,
            );
          }
          errorSortingVersions = true;
          return 0;
        }
      });

      if (errorSortingVersions) {
        return supportedGameVersions.every((g) =>
          version?.supportedGameVersions.some((s) => s.version === g),
        );
      } else {
        return (
          version?.supportedGameVersions.some(
            (v) => v.version === earliestGameVersion[0],
          ) ?? false
        );
      }
    }, "Must support earliest game version!");
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
    let modVersion = tempRawDepAllVersions.find(
      (mV) => mV.modVersion === tempRawDepVersion && mV.modId === mod?.id,
    );
    rawDeps.push({
      name: tempRawDepName,
      id: mod?.id ?? -1,
      version: tempRawDepVersion,
      versionId: modVersion?.id ?? -1,
    });
    tempRawDepName = "";
    tempRawDepVersion = "";
    tempRawDepAllVersions = [];
  }

  function upload() {
    console.log("Uploading... pray");

    let formData = new FormData();

    let gvStringIds = supportedGameVersions
      .map((v) => allGameVersions.versions.find((g) => g.version === v)?.id)
      .filter((v) => !!v)
      .join(",");

    formData.append("supportedGameVersionIds", gvStringIds);

    if (rawDeps && rawDeps.length > 0) {
      let depStringIds = rawDeps.map((d) => d.versionId).join(",");
      formData.append("dependencies", depStringIds);
    }

    formData.append("modVersion", modVersion);
    formData.append("platform", platform.toString());
    if (modZip) {
      formData.append("file", modZip);
    }

    axios
      .post(appendURL(`api/mods/${mod?.info.id}/upload`), formData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          if (response.data !== null) {
            console.log(response);
            if (alsoSubmitForVerification) {
              axios.post(appendURL(`api/modversions/${response.data.modVersion.id}/submit`), {}, { withCredentials: true }).then((res) => {
                if (res.status === 200) {
                  window.location.href = "/mods/" + response.data.modVersion.modId;
                } else {
                  errorObj = res.data;
                }
              }).catch((error) => {
                console.error("An error occurred, contact a developer!");
                console.error(error);
                if (error.response) {
                  if (error.response.status && error.response.data) {
                    console.error(error.response.status);
                    console.error(error.response.data);
                    errorObj = error.response.data;
                  }
                }
              });
            } else {
              window.location.href = "/mods/" + response.data.modVersion.modId;
            }
          }
        }
      })
      .catch((error) => {
        console.error("An error occurred, contact a developer!");
        console.error(error);
        if (error.response) {
          if (error.response.status && error.response.data) {
            console.error(error.response.status);
            console.error(error.response.data);
            errorObj = error.response.data;
          }
        }
      });
  }

  async function importDepenenciesFromOtherVersion() {
    // this will unfortuntnaly be ineffiecint, but fuck it wii ball
    let versionToPullFrom = selectedVersion;
    if (!versionToPullFrom) {
      console.error(`borked`);
      return;
    }

    for (let depId of versionToPullFrom.dependencies) {
      let modData = await axios.get(appendURL(`/api/modversions/${depId}?raw=true`)).then((res) => {
        if (res.status !== 200) {
          return null;
        } else {
          return res.data;
        }
      })

      rawDeps.push({
        id: modData.mod.id,
        name: modData.mod.name,
        version: modData.modVersion.modVersion,
        versionId: modData.modVersion.id
      })
    }
    tempRawDepName = "";
    tempRawDepVersion = ""
  }

  function importGameVersionsFromOtherVersion() {
    let versionToPullFrom = selectedVersion;
    if (!versionToPullFrom) {
      console.error(`borked`);
      return;
    }
    for (let sGV of versionToPullFrom.supportedGameVersions) {
      tempSelectedVersion = sGV.version
      if (supportedGameVersions.includes(tempSelectedVersion)) {
        continue;
      }
      addVersion();
    }
    selectedVersion = undefined;
  }

  async function importFromOtherVersion() {
    let versionToPullFrom = selectedVersion;
    if (!versionToPullFrom) {
      console.error(`borked`);
      return;
    }
    importDepenenciesFromOtherVersion();
    //modVersion = versionToPullFrom?.modVersion;
    importGameVersionsFromOtherVersion();
  }

  let disableImportButton = $derived.by(() => {
    if (!selectedVersion) {
      return true;
    }

    if (rawDeps.length > 0) {
      return true
    }
    return false;
  })
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
        latestSize={undefined}
        author={mod?.info.authors}
        smallCorners={true}
      />
    {/if}
  {/await}
  <div class="mx-8 flex h-fit w-auto flex-row gap-4">
    <Accordion collapsible={true} class="w-full">
      <AccordionItem value="item-1">
        <AccordionHeader class="items-center gap-2" position="start" as="h1">
          <p>Advanced Settings</p>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <ChevronDoubleDownFilled />
          </svg>
        </AccordionHeader>
        <AccordionPanel>
          <div class="p-4 flex h-fit w-auto flex-col gap-4 bg-neutral-background-2 rounded-xl">
            <div>
              <p class="fs-4">Import version metadata from another already uploaded version of {mod?.info.name}.</p>
            </div>
            <div class="p-1 flex h-fit w-auto flex-row gap-4 bg-neutral-background-2">
          <Dropdown.Root class="max-w-[196px]" bind:value={selectedVersion}>
            <Dropdown.Trigger let:data>
              <InputSkin class="min-w-[196px]">
                {#if data}
                  <span>{data.modVersion}</span>
                {:else}
                  <span>Select a Version</span>
                {/if}
                <Dropdown.Arrow />
              </InputSkin>
            </Dropdown.Trigger>
      
            <Dropdown.Menu>
              {#if mod}
              <div class="flex max-h-[400px] min-h-[150px] flex-col overflow-scroll rounded">
                {#each mod.versions as item}
                  <Dropdown.Item value={item} data={item}>{`${item.modVersion}`}</Dropdown.Item>
                {/each}
              </div>
              {/if}
            </Dropdown.Menu>
          </Dropdown.Root>
          <Button disabled={disableImportButton} class="min-w-[160px]" on:click={importFromOtherVersion}>Import All Metadata</Button>
          <Button disabled={disableImportButton} class="min-w-[160px]" on:click={importGameVersionsFromOtherVersion}>Import Game Versions</Button>
          <Button disabled={disableImportButton} class="min-w-[160px]" on:click={importDepenenciesFromOtherVersion}>Import Dependencies</Button>
        </div>
        </div>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  </div> 
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
        <input
          type="file"
          onchange={(e) => {
            const target = e.target as HTMLInputElement;
            if (target && target.files && target.files.length == 1) {
              if (target.files[0].size > +env.PUBLIC_FILE_UPLOAD_LIMIT_MB * 1024 * 1024) {
                console.log("File too large, checking roles");
                if (!userData.authenticated ||  userData.roles == null || !checkUserAnyGame(userData.roles, UserRoles.LargeFiles)){
                  console.log("no roles, denying upload");
                  return;
                }
                console.log("roles good, continuing upload");
              }
              modZip = target.files[0];
            }
          }}
        />
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
            <!--<Input
              bind:value={tempRawDepVersion}
              ariaInvalid={!dependencyVersionValidity.success &&
                dependencyNameValidity.success}
              disabled={tempRawDepAllVersions.length === 0 ||
                loadingTempRawDepVersions}
              class="w-56"
            />
            -->
            <Dropdown.Root class="max-w-[196px]" bind:value={tempRawDepVersion}>
              <Dropdown.Trigger let:data>
                <InputSkin disabled={tempRawDepAllVersions.length === 0 ||
                  loadingTempRawDepVersions} ariaInvalid={!dependencyVersionValidity.success &&
                    dependencyNameValidity.success} class="min-w-[196px]">
                  {#if data && tempRawDepAllVersions.length > 0}
                    <span>{data}</span>
                  {:else}
                    <span>Select a Version</span>
                  {/if}
                  <Dropdown.Arrow />
                </InputSkin>
              </Dropdown.Trigger>
              <Dropdown.Menu >
                <div class="flex max-h-[400px] min-h-[150px] flex-col overflow-scroll rounded">
                {#if tempRawAllowedVersions}
                  {#each tempRawAllowedVersions as item}
                    <Dropdown.Item value={item.modVersion} data={item.modVersion}>{`${item.modVersion}`}</Dropdown.Item> <!--TODO: actually use the object instead of going from obj > string > obj-->
                  {/each}
                {/if}
                </div>
              </Dropdown.Menu>
            </Dropdown.Root>

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
      errorObj = null;
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
      {#if errorObj !== null}
        <p class="text-red-500">{errorObj.message ? errorObj.message : `Unknown error.`}<br>See browser console for more information.</p>
      {/if}
    </Dialog.Body>

    <Dialog.Actions class="justify-end">
			<Label class="flex flex-row items-center justify-center text-base pr-4">
				<Checkbox  bind:value={alsoSubmitForVerification} />
				<p>Submit After Upload</p>
			</Label>
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
