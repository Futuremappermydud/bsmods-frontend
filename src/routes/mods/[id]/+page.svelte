<script lang="ts">
  import GameVersionPicker from "$lib/components/ui/filtering/GameVersionPicker.svelte";
  import MarkdownViewer from "$lib/components/ui/markdown/MarkdownViewer.svelte";
  import VersionCard from "$lib/components/ui/versions/VersionCard.svelte";
  import type { IndividualModData, ModData } from "$lib/types/Mods";
  import {
      App,
    Button,
    Field,
    FieldMessageError,
    Input,
    Link,
    Spinner,
  } from "@svelte-fui/core";
  import type { PageData } from "./$types";
  import axios from "axios";
  import { appendURL } from "$lib/utils/url";
  import { checkUser, UserRoles } from "$lib/types/UserRoles";
  import ModCardEditable from "$lib/components/ui/mods/ModCardEditable.svelte";
  import { z } from "zod";
  import DescriptionPage from "$lib/components/ui/upload/DescriptionPage.svelte";
  import { untrack } from "svelte";
  import { Categories, convertCategories } from "$lib/types/Categories";
  import { sendRevoke, sendSaveEdit, sendSubmit } from "$lib/utils/api";
  import VersionCardV2 from "$lib/components/ui/versions/VersionCardV2.svelte";
  import type { DisplayApprovalModalFunction } from "$lib/types/Approval";
  import ApprovalDialog from "$lib/components/ui/approval/ApprovalDialog.svelte";
  import { insertSpaces } from "$lib/utils/string";
  import { Status } from "$lib/types/Status";

  let { data }: { data: PageData } = $props();

  let mod: IndividualModData | undefined = $state();
  let editing = $state(false);
  let approvalModal: { displayApprovalModal: DisplayApprovalModalFunction } & ApprovalDialog;

  let isMadeByUser = $derived.by(() => {
    if (!mod) return false;
    return mod.info.authors.some((a) => a.id === data.userId);
  });

  let userIsApprover = $derived.by(() => {
    if (!mod) return false;
    if (!data.roles) return false;
    return checkUser(data.roles, UserRoles.Approver, mod?.info.gameName);
  });

  let version = $state("");
  let knownStatuses = $derived.by(() => {
      if (!mod) return [Status.Verified];
      if (!userIsApprover && !isMadeByUser) {
        return [Status.Verified]
      }
      return Array.from(new Set([Status.Verified, ...mod.versions.map((v) => v.status)]));
  });
  let statuses = $state<string[]>(Object.values(Status));   
    

  let versions = $derived.by(() => {
    console.log("Filtering versions for mod", data.id, "with version", version, "and statuses", statuses);
    if (!mod) return [];
    //if (version === "") return mod.versions;
    return mod.versions.filter((v) => {
      if (version !== "") {
        if(!v.supportedGameVersions.some((g) => g.version === version)) {
          return false;
        }
      }
      if (statuses.includes(v.status)) {
        return true;
      }
      return false;
    });
  });

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

  let isAllowedToEdit = $derived.by(() => {
    if (!mod) return false;
    if (userIsApprover) return true;
    if (isMadeByUser) return true;
    return false;
  });

  let denialClicks = $state(0);
  let loadingDenial = $state(false);

  let submitClicks = $state(0);
  let loadingSubmit = $state(false);

  function deny() {
    denialClicks += 1;
    if (denialClicks > 1) {
      loadingDenial = true;
      sendRevoke(mod, () => {
        loadingDenial = false;
      });
    }
  }

  function submit() {
    submitClicks += 1;
    if (submitClicks > 1) {
      loadingSubmit = true;
      sendSubmit(mod, () => {
        loadingDenial = false;
      });
    }
  }

  // Editing

  let selectedGame: string | undefined = $state(undefined);
  let category: Categories | undefined = $state(undefined);
  let modName: string | undefined = $state(undefined);
  let summary: string | undefined = $state(undefined);
  let icon: string | undefined = $state(undefined);
  let iconFile: File | undefined = $state();
  let gitUrl: string | undefined = $state(undefined);
  let description: string | undefined = $state(undefined);

  function explicitEffect(fn: () => void, depsFn: () => {}) {
    $effect(() => {
      depsFn();
      untrack(fn);
    });
  }

  explicitEffect(
    () => {
      if (mod) {
        selectedGame = mod.info.gameName;
        category = convertCategories(mod.info.category);
        console.log(category + " to " + mod.info.category);
        modName = mod.info.name;
        summary = mod.info.summary;
        icon = appendURL(`cdn/icon/${mod.info.iconFileName}`);
        gitUrl = mod.info.gitUrl;
        description = mod.info.description;
      }
    },
    () => [mod],
  );

  // Metadata Validation

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
  let descriptionScheme = z
    .string()
    .max(4096, "Description must contain at most 4096 character(s)");

  let gitUrlValidity = $derived(gitUrlScheme.safeParse(gitUrl));

  let loadingSave = $state(false);

  function save() {
    console.log("Saving...");
    if (
      !selectedGame ||
      !category ||
      !modName ||
      !summary ||
      !gitUrl ||
      !description
    )
      return;
    loadingSave = true;
    sendSaveEdit(
      mod,
      selectedGame,
      category,
      modName,
      summary,
      gitUrl,
      description,
      () => {
        loadingSave = false;
      },
    );
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
      <ModCardEditable
        mod={mod?.info}
        isMadeByUser={isAllowedToEdit}
        bind:editing
        bind:modName
        bind:summary
        bind:icon
        bind:iconFile
        saveFunc={save}
      />
      <div class="flex flex-col gap-4 lg:flex-row">
        <div
          class="order-2 flex flex-1 flex-col"
          class:opacity-50={editing}
          class:pointer-events-none={editing}
        >
          <div class="flex flex-col gap-4">
            {#if userIsApprover}
              <div class="flex flex-col items-center gap-2 rounded-xl bg-neutral-background-2 p-4 shadow-4">
                <p class="text-sm font-semibold">
                  Mod Approval
                </p>
                <Button class="text-palette-red-foreground-1" onclick={() => {
                  if (!mod) {
                    console.error("No mod found for approval modal!");
                    return;
                  }
                  approvalModal.displayApprovalModal(
                    "mod",
                    `${mod?.info.name}`,
                    ``,
                    mod.info,
                    mod.info.id,
                    () => {},
                  );
                }}>
                  Open Approval Panel
                </Button>
              </div>
            {/if}
            {#if isMadeByUser && mod.info.status === "private"}
              <div
                class="flex flex-col items-center gap-2 rounded-xl bg-neutral-background-2 p-4 shadow-4"
              >
                <p class="text-sm font-semibold">
                  This mod is <i>private</i>!
                </p>
                <p class="text-sm font-semibold">
                  Only you (and admins) can see it.
                </p>
                {#if loadingSubmit}
                  <div
                    class="flex h-fit flex-row items-center justify-center gap-4"
                  >
                    <Spinner />
                    <p>Loading...</p>
                  </div>
                {:else}
                  <Button onclick={submit}>
                    <div class="flex flex-row gap-2">
                      <div
                        class="h-2 w-2 rounded-circular bg-neutral-foreground-3 opacity-20"
                        class:!opacity-80={submitClicks > 0}
                      ></div>
                      <div
                        class="h-2 w-2 rounded-circular bg-neutral-foreground-3 opacity-20"
                        class:!opacity-80={submitClicks > 1}
                      ></div>
                    </div>
                    Submit!
                  </Button>
                {/if}
              </div>
            {/if}
            {#if isMadeByUser}
              <div
                class="flex flex-col items-center gap-2 rounded-xl bg-neutral-background-2 p-4 shadow-4"
              >
                <Button href="/upload/version/{mod.info.id}">
                  Add a new version
                </Button>
              </div>
            {/if}
            <div class="rounded-xl bg-neutral-background-2 p-4 shadow-4">
              <GameVersionPicker
                selectedGame={mod.info.gameName}
                bind:selectedVersion={version}
              />
              {#if userIsApprover || isMadeByUser}
              <div class="flex flex-row flex-wrap gap-1 pt-4">
                <p class="text-base pr-1">Status: </p>
                {#each knownStatuses as status}
                  <Button
                    appearance={statuses.includes(status) ? "primary" : "subtle"}
                    shape="circular"
                    class="!text-xs !font-semibold !text-neutral-foreground-1"
                    onclick={() => {
                      if (statuses.includes(status)) {
                        statuses = statuses.filter((s) => s !== status);
                      } else {
                        statuses = [...statuses, status];
                      }
                    }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                {/each}
              </div>
              {/if}
            </div>
            {#each versions as version (version.id)}
              {#if version.status == "verified" || /*version.status == "unverified" ||*/ userIsApprover || isMadeByUser}
                <VersionCardV2
                  id={version.id.toString()}
                  {version}
                  mod={mod.info}
                  isApprover={userIsApprover}
                  isAuthor={isMadeByUser}
                  displayApprovalModal={approvalModal.displayApprovalModal}
                />
              {/if}
            {/each}
          </div>
        </div>
        <div class="order-1 flex flex-[2.5] flex-col gap-4 lg:order-3">
          <div
            class="flex h-fit flex-col rounded-xl bg-neutral-background-2 p-4 shadow-4"
          >
            {#if editing}
              <div class="git-url flex flex-row">
                <h2 class="self-center p-2 text-lg font-semibold">More Info</h2>
                <div
                  class="!my-auto flex h-fit w-[400px] flex-1 flex-row gap-1 md:mt-1"
                >
                  <Field state={gitUrlValidity.success ? "success" : "error"}>
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
            {:else}
              <div class="flex flex-row justify-evenly gap-2">
                <div class="flex flex-col gap-1 justify-center align-middle">
                  <p class="text-sm font-semibold">More Info:</p>
                  <Link href={mod.info.gitUrl} target="=_blank" rel="no-referrer">{mod.info.gitUrl.includes(`github.com`) ? `Source Control` : `Website`}</Link>
                </div>
                <div class="flex flex-col gap-1 justify-center align-middle">
                  <p class="text-sm font-semibold">Category:</p>
                  <p class="silly-capitalize">{mod.info.category}</p>
                </div>
                <div class="flex flex-col gap-1 justify-center align-middle">
                  <p class="text-sm font-semibold">Game:</p>
                  <p class="silly-capitalize">{insertSpaces(mod.info.gameName)}</p>
                </div>
                <div class="flex flex-col gap-1 justify-center align-middle">
                  <p class="text-sm font-semibold">Status:</p>
                  <p class="silly-capitalize">{mod.info.status}</p>
                </div>
                <div class="flex flex-col gap-1 justify-center align-middle">
                  <p class="text-sm font-semibold">Created at:</p>
                  <p class="silly-capitalize">{new Date(mod.info.createdAt).toLocaleString()}</p>
                </div>
              </div>
            {/if}
          </div>
          <div
            class="flex h-fit flex-col rounded-xl bg-neutral-background-2 p-4 shadow-4"
            class:min-h-[400px]={editing}
          >
            {#if editing}
              <DescriptionPage bind:text={description} {descriptionScheme}
              ></DescriptionPage>
            {:else}
              <MarkdownViewer text={mod.info.description} />
            {/if}
          </div>
        </div>
      </div>
    {/if}
  {/await}
</div>

<ApprovalDialog bind:this={approvalModal} />

<style lang="postcss">
  :global(.fui-field:not(:has(.fui-text-area))) {
    @apply !flex !flex-col;
  }

  :global(.fui-field:has(.fui-text-area)) {
    @apply w-full;
  }

  .git-url {
    :global(.fui-label) {
      @apply hidden;
    }
  }
</style>
