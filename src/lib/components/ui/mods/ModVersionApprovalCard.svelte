<script lang="ts">
  import type { Mod, SupportedGameVersion } from "$lib/types/Mods";
  import { Button, Link, Spinner, Dialog } from "@svelte-fui/core";
  import ModCardBase from "./ModCardBase.svelte";
  import { CheckmarkRegular, DismissRegular } from "@svelte-fui/icons";
  import { appendURL } from "$lib/utils/url";
  import axios from "axios";
  import type {
    ModVersionDBObject,
    VersionApproval,
  } from "$lib/types/Approval";

  let {
    versionApproval,
    gameVersions,
  }: {
    versionApproval: VersionApproval;
    gameVersions: SupportedGameVersion[];
  } = $props();

  let loading = $state(false);
  let hide = $state(false);

  let approvalClicks = $state(0);
  let denialClicks = $state(0);

  let showModal = $state(false);
  let modalHeader = $state("");
  let modalBody: {
    header: string;
    body: string;
  }[] = $state([]);

  function approve() {
    approvalClicks += 1;
    if (approvalClicks > 1) {
      loading = true;
      sendStatus("verified");
    }
  }

  function deny() {
    denialClicks += 1;
    if (denialClicks > 1) {
      loading = true;
      sendStatus("removed");
    }
  }

  function sendStatus(status: string) {
    axios
      .post(
        appendURL(
          `api/approval/modVersion/${versionApproval.version.id}/approve`,
        ),
        {
          status: status,
        },
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          if (response.data !== null) {
            //window.location.reload();
            loading = false;
            hide = true;
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

{#snippet approvalButtons()}
  <div class="flex flex-row gap-2">
    <div class="flex h-full min-w-20 flex-col gap-[3px]">
      <div
        class="silly-capitalize w-full rounded bg-neutral-background-1 p-1 text-xs"
      >
        {versionApproval.version.modVersion}
      </div>
      <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
        {versionApproval.version.status}
      </div>
      <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
        <Link
          on:click={() => {
            modalHeader = "Content Hashes";
            modalBody = versionApproval.version.contentHashes.map((hash) => {
              return {
                header: hash.path,
                body: hash.hash,
              };
            });
            showModal = true;
          }}
          >{versionApproval.version.contentHashes.length}
          {versionApproval.version.contentHashes.length == 1
            ? `File`
            : `Files`}</Link
        >
      </div>
      <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
        <Link
          on:click={async () => {
            modalHeader = "Dependencies";
            modalBody = [];
            for (const dep of versionApproval.version.dependencies) {
              await axios
                .get(
                  appendURL(
                    `api/modVersions/${encodeURIComponent(dep)}?raw=true`,
                  ),
                )
                .then((response) => {
                  if (
                    response.status === 200 &&
                    response.data &&
                    response.data.mod
                  ) {
                    let mod = response.data.mod as Mod;
                    let modVersion = response.data
                      .modVersion as ModVersionDBObject;
                    modalBody.push({
                      header: `${mod.name} (${modVersion.modVersion})`,
                      body: `Mod Status: ${mod.status}\nVersion Status: ${modVersion.status}\nVersion: ${modVersion.modVersion}\nPlatform: ${modVersion.platform}\nGame Versions: ${modVersion.supportedGameVersionIds
                        .map((gameVersion) => {
                          let versionString = gameVersions.find(
                            (gv) => gv.id === gameVersion,
                          )?.version;
                          return versionString
                            ? versionString
                            : `${gameVersion}`;
                        })
                        .join(
                          ", ",
                        )}\nGitHub: ${mod.gitUrl}\nDownload: /cdn/mods/${modVersion.zipHash}`,
                    });
                  }
                });
            }
            showModal = true;
          }}
          >{versionApproval.version.dependencies.length}
          {versionApproval.version.dependencies.length == 1
            ? `Dep`
            : `Deps`}</Link
        >
      </div>
    </div>
    <div class="flex h-full min-w-20 flex-col gap-[3px]">
      <div
        class="silly-capitalize w-full rounded bg-neutral-background-1 p-1 text-xs"
      >
        {versionApproval.version.platform}
      </div>
      <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
        {versionApproval.version.supportedGameVersionIds
          .map((gameVersion) => {
            let versionString = gameVersions.find(
              (gv) => gv.id === gameVersion,
            )?.version;
            return versionString ? versionString : `${gameVersion}`;
          })
          .join(", ")}
      </div>
      <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
        <Link href={versionApproval.mod.gitUrl} target="=_blank" rel="no-referrer">GitHub</Link>
      </div>
      <div class="w-full rounded bg-neutral-background-1 p-1 text-xs">
        <Link href={appendURL(`cdn/mod/${versionApproval.version.zipHash}.zip`)}
          >Download</Link
        >
      </div>
    </div>
    <div class="flex h-full w-14 flex-col gap-2">
      <Button
        class="flex aspect-square h-8 flex-1 flex-grow flex-col gap-0 p-1"
        onclick={approve}
      >
        <div class="flex flex-row gap-2">
          <div
            class="h-2 w-2 rounded-circular bg-neutral-foreground-3 opacity-20"
            class:!opacity-80={approvalClicks > 0}
          ></div>
          <div
            class="h-2 w-2 rounded-circular bg-neutral-foreground-3 opacity-20"
            class:!opacity-80={approvalClicks > 1}
          ></div>
        </div>
        <svg
          viewBox="0 0 20 20"
          class="aspect-square h-auto text-palette-green-foreground-3"
        >
          <CheckmarkRegular />
        </svg>
      </Button>
      <Button
        class="flex aspect-square h-8 flex-1 flex-grow flex-col gap-0 p-1"
        onclick={deny}
      >
        <div class="flex flex-row gap-2">
          <div
            class="h-2 w-2 rounded-circular bg-neutral-foreground-3 opacity-20"
            class:!opacity-80={denialClicks > 0}
          ></div>
          <div
            class="h-2 w-2 rounded-circular bg-neutral-foreground-3 opacity-20"
            class:!opacity-80={denialClicks > 1}
          ></div>
        </div>
        <svg
          viewBox="0 0 19 19"
          class="aspect-square h-auto text-palette-red-foreground-3"
        >
          <DismissRegular />
        </svg>
      </Button>
    </div>
  </div>
{/snippet}

{#snippet info()}
  Mod ID: {versionApproval.mod.id}<br>
  Version ID: {versionApproval.version.id}
{/snippet}

{#if !hide}
  {#if loading}
    <div
      class="relative h-28 rounded-[17.5px] bg-neutral-background-2 shadow-4"
    >
      <div
        class="pointer-events-none absolute bottom-1 left-1 right-1 top-1 float-left rounded-[13.5px] border-2 border-dashed border-neutral-background-6"
      ></div>
      <div class="flex h-28 flex-row items-center justify-center gap-4">
        <Spinner />
        <p>Loading...</p>
      </div>
    </div>
  {:else}
    <ModCardBase 
      mod={versionApproval.mod} 
      latestSize={versionApproval.version.fileSize} 
      author={versionApproval.mod.authors} 
      slot={approvalButtons} 
      info={info}
    />
  {/if}
{/if}

<Dialog.Root bind:open={showModal} type="modal">
  <Dialog.Header>{modalHeader}</Dialog.Header>

  <Dialog.Body>
    <div class="flex flex-col gap-4 py-6">
      {#each modalBody as { header, body }}
        <div class="flex flex-col gap-2">
          <p class="font-semibold">{header}</p>
          <pre
            class="text-wrap rounded-md bg-neutral-background-1 p-1">{body}</pre>
        </div>
      {/each}
    </div>
  </Dialog.Body>
</Dialog.Root>
