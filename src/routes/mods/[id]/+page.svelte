<script lang="ts">
  import GameVersionPicker from "$lib/components/ui/filtering/GameVersionPicker.svelte";
  import MarkdownViewer from "$lib/components/ui/markdown/MarkdownViewer.svelte";
  import ModCardNeo from "$lib/components/ui/mods/ModCardNeo.svelte";
  import VersionCard from "$lib/components/ui/versions/VersionCard.svelte";
  import type { IndividualModData } from "$lib/types/Mods";
  import { Link } from "@svelte-fui/core";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  let mod: IndividualModData = data.mod.mod;

  let version = $state("");

  let versions = $derived.by(() => {
    if (version === "") return mod.versions;
    return mod.versions.filter((v) =>
      v.supportedGameVersions.some((g) => g.version === version),
    );
  });
</script>

<div class="flex flex-col gap-4">
  <ModCardNeo
    mod={mod.info}
    author={mod.versions[0].author}
    downloads={0}
    hasVersion={false}
    smallCorners={true}
  />
  <div class="flex flex-col gap-4 lg:flex-row">
    <div class="order-2 flex flex-1 flex-col">
      <div class="flex flex-col gap-4">
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
</div>
