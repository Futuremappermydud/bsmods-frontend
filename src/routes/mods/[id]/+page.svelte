<script lang="ts">
  import GameVersionPicker from "$lib/components/ui/filtering/GameVersionPicker.svelte";
  import MarkdownViewer from "$lib/components/ui/markdown/MarkdownViewer.svelte";
  import VersionCard from "$lib/components/ui/versions/VersionCard.svelte";
  import type { IndividualModData } from "$lib/types/Mods";
  import { Button, Link, Spinner } from "@svelte-fui/core";
  import type { PageData } from "./$types";
  import axios from "axios";
  import { appendURL } from "$lib/utils/url";
  import ModCardBase from "$lib/components/ui/mods/ModCardBase.svelte";
  import { checkUser, UserRoles } from "$lib/types/UserRoles";

  let { data }: { data: PageData } = $props();

  let mod: IndividualModData | undefined = $state();

  let version = $state("");

  let versions = $derived.by(() => {
    if (!mod) return [];
    if (version === "") return mod.versions;
    return mod.versions.filter((v) =>
      v.supportedGameVersions.some((g) => g.version === version),
    );
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

  let isMadeByUser = $derived.by(() => {
    if (!mod) return false;
    return mod.info.authors.some((a) => a.id === data.userId);
  });

  let userIsApprover = $derived(
    mod && checkUser(data.roles, UserRoles.Approver, mod?.info.gameName),
  );

  let denialClicks = $state(0);
  let loadingDenial = $state(false);

  let submitClicks = $state(0);
  let loadingSubmit = $state(false);

  function deny() {
    denialClicks += 1;
    if (denialClicks > 1) {
      loadingDenial = true;
      sendRevoke();
    }
  }

  function submit() {
    submitClicks += 1;
    if (submitClicks > 1) {
      loadingSubmit = true;
      sendSubmit();
    }
  }

  function sendSubmit() {
    axios
      .post(appendURL(`api/mods/${mod?.info.id}/submit`), {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          if (response.data !== null) {
            window.location.reload();
            loadingSubmit = false;
          }
        } else {
        }
      })
      .catch((error) => {
        console.error("An error occurred, contact a developer!");
        console.error(error);
      });
  }

  function sendRevoke() {
    axios
      .post(
        appendURL(`api/approval/mod/${mod?.info.id}/approve`),
        {
          status: "unverified",
        },
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        if (response.status === 302 || response.status === 200) {
          if (response.data !== null) {
            window.location.reload();
            loadingDenial = false;
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
      <div class="flex flex-col gap-4 lg:flex-row">
        <div class="order-2 flex flex-1 flex-col">
          <div class="flex flex-col gap-4">
            {#if userIsApprover && mod.info.status === "verified"}
              <div
                class="flex flex-col items-center gap-2 rounded-xl bg-neutral-background-2 p-4 shadow-4"
              >
                <p class="text-sm font-semibold">
                  This mod has already been <i>verified</i>!
                </p>
                <p
                  class="w-max text-sm font-bold text-palette-red-foreground-1"
                >
                  Revoking verification can have dire consequences!
                </p>
                {#if loadingDenial}
                  <div
                    class="flex h-fit flex-row items-center justify-center gap-4"
                  >
                    <Spinner />
                    <p>Loading...</p>
                  </div>
                {:else}
                  <Button class="text-palette-red-foreground-1" onclick={deny}>
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
                    Revoke Verification
                  </Button>
                {/if}
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
            </div>
            {#each versions as version (version.id)}
              <VersionCard {version} />
            {/each}
          </div>
        </div>
        <div class="order-1 flex flex-[2.5] flex-col gap-4 lg:order-3">
          <div
            class="flex h-fit flex-col rounded-xl bg-neutral-background-2 p-4 shadow-4"
          >
            <h2 class="text-lg font-semibold">
              More Info <Link href={mod.info.gitUrl}>Here!</Link>
            </h2>
          </div>
          <div
            class="flex h-fit flex-col rounded-xl bg-neutral-background-2 p-4 shadow-4"
          >
            <h1 class="text-xl font-semibold">Description:</h1>
            <MarkdownViewer text={mod.info.description} />
          </div>
        </div>
      </div>
    {/if}
  {/await}
</div>
