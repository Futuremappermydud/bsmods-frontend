<script lang="ts">
  import type { Mod, SupportedGameVersion } from "$lib/types/Mods";
  import { Button, Link, Spinner } from "@svelte-fui/core";
  import ModCardBase from "./ModCardBase.svelte";
  import { CheckmarkRegular, DismissRegular, LineFilled } from "@svelte-fui/icons";
  import { appendURL } from "$lib/utils/url";
  import axios from "axios";
  import {
    ApprovalAction,
    type DisplayModalFunction,
    type ModVersionDBObject,
    type VersionApproval,
  } from "$lib/types/Approval";

  let {
    versionApproval,
    gameVersions,
    displayModal,
  }: {
    versionApproval: VersionApproval;
    gameVersions: SupportedGameVersion[];
    displayModal: DisplayModalFunction;
  } = $props();

  let loading = $state(false);
  let hide = $state(false);

  let approvalClicks = $state(0);
  let unverifyClicks = $state(0);
  let denialClicks = $state(0);

  function approve() {
    approvalClicks += 1;
    if (approvalClicks > 1) {
      loading = true;
      sendStatus(ApprovalAction.Accept);
    }
  }

  function unverify() {
    unverifyClicks += 1;
    if (unverifyClicks > 1) {
      loading = true;
      sendStatus(ApprovalAction.Deny);
    }
  }

  function deny() {
    denialClicks += 1;
    if (denialClicks > 1) {
      loading = true;
      sendStatus(ApprovalAction.Remove);
    }
  }

  function sendStatus(status: ApprovalAction) {
    axios
      .post(
        appendURL(
          `api/approval/modVersion/${versionApproval.version.id}/approve`,
        ),
        {
          action: status,
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
            let modalBody = versionApproval.version.contentHashes.map((hash) => {
              return {
                header: hash.path,
                body: hash.hash,
              };
            });
            displayModal(
              "Content Hashes",
              modalBody,
            );
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
            let modalBody:{header: string, body: string}[] = [];
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
            displayModal(
              "Dependencies",
              modalBody,
            );
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
        class="flex aspect-square h-8 flex-1 flex-grow flex-row gap-0 p-1"
        onclick={approve}
      >
        <div class="flex flex-row gap-1">
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
          class="aspect-square h-auto text-palette-green-foreground-3 pl-1"
        >
          <CheckmarkRegular />
        </svg>
      </Button>
      <Button class="flex aspect-square h-8 flex-1 flex-grow flex-row gap-0 p-1"
      onclick={unverify}
    >
      <div class="flex flex-row gap-1">
        <div
          class="h-2 w-2 rounded-circular bg-neutral-foreground-3 opacity-20"
          class:!opacity-80={unverifyClicks > 0}
        ></div>
        <div
          class="h-2 w-2 rounded-circular bg-neutral-foreground-3 opacity-20"
          class:!opacity-80={unverifyClicks > 1}
        ></div>
      </div>
      <svg
        viewBox="0 0 20 20"
        class="aspect-square h-auto text-palette-yellow-foreground-3 pl-1"
      >
        <LineFilled />
      </svg>

      </Button>
      <Button
        class="flex aspect-square h-8 flex-1 flex-grow flex-row gap-0 p-1"
        onclick={deny}
      >
        <div class="flex flex-row gap-1">
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
          class="aspect-square h-auto text-palette-red-foreground-3 pl-1"
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
