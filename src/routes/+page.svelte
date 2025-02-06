<script lang="ts">
  import { Link } from "@svelte-fui/core";
</script>

<section
  class="mx-10 mt-10 flex w-stretch flex-col items-center gap-28 md:mx-14"
>
  <div class="flex flex-col items-center">
    <h1 class="flex flex-row font-nunito text-6xl font-bold">
      <span class="text-beatmods-pink">Beat</span>
      <span class="text-beatmods-purple">Mods</span>
    </h1>
    <p class="mt-2 text-center">
      A Beat Saber mod repository maintained by the Beat Saber Modding Group
    </p>
  </div>
  <div class="flex flex-col gap-8 pb-4">
    <div class="flex w-full flex-col gap-8 lg:flex-row">
      <div
        class="flex aspect-square w-full flex-1 flex-col items-center rounded-xl bg-neutral-background-2 p-4 shadow-16"
      >
        <h2 class="text-xl font-semibold">Discover</h2>
        <h3 class="text-center text-sm text-neutral-foreground-2">
          Find mods that suit you best.
        </h3>
      </div>
      <div
        class="flex aspect-square w-full flex-1 flex-col items-center rounded-xl bg-neutral-background-2 p-4 shadow-16"
      >
        <h2 class="text-xl font-semibold">Create</h2>
        <h3 class="text-center text-sm text-neutral-foreground-2">
          Upload and create your own mods for the community.
        </h3>
        <div class="mt-8 flex w-stretch flex-1 flex-col gap-4">
          <a
            href="https://bsmg.wiki/modding/"
            target="=_blank"
            rel="no-referrer"
            class="flex flex-1 items-center justify-center rounded-lg bg-green-400 p-2 shadow-4 transition-colors duration-100 hover:bg-green-500 dark:bg-green-800 hover:dark:bg-green-700"
          >
            <p class="font-semibold">Mod Creation Guide</p>
          </a>
          <a
            href="/upload"
            class="flex flex-1 items-center justify-center rounded-lg bg-brand-teams-80 p-2 shadow-4 transition-colors duration-100 hover:bg-brand-teams-90"
          >
            <p class="font-semibold">Upload a Mod</p>
          </a>
        </div>
      </div>
      <div
        class="flex aspect-square w-full flex-1 flex-col items-center rounded-xl bg-neutral-background-2 p-4 shadow-16"
      >
        <h2 class="text-xl font-semibold">Manage</h2>
        <h3 class="text-center text-sm text-neutral-foreground-2">
          Use a Beatmods-compatible mod manager to seamlessly manage your mods.
        </h3>
        <div class="mt-8 flex w-stretch flex-1 flex-col gap-4">
          <a
            href="https://www.bsmanager.io/"
            target="=_blank"
            rel="no-referrer"
            class="flex flex-1 items-center justify-center rounded-lg bg-brand-web-80 p-2 shadow-4 transition-colors duration-100 hover:bg-brand-web-90"
          >
            <p class="font-semibold">
              BSManager <span class="text-sm text-yellow-200"
                >(★ Recommended)</span
              >
            </p>
          </a>
          <a
            href="https://github.com/bsmg/ModAssistant/releases/latest"
            target="=_blank"
            rel="no-referrer"
            class="flex flex-1 items-center justify-center rounded-lg bg-red-600 p-2 shadow-4 transition-colors duration-100 hover:bg-red-500"
          >
            <p class="font-semibold">Mod Assistant</p>
          </a>
          <a
            href="https://example.com"
            target="=_blank"
            rel="no-referrer"
            aria-disabled={true}
            class="pointer-events-none flex flex-1 items-center justify-center rounded-lg bg-moddingpink-signaturePink p-2 opacity-40 shadow-4"
          >
            <p class="font-semibold">PinkModManager (WIP)</p>
          </a>
        </div>
      </div>
    </div>
    <div
      class="flex h-fit w-full flex-1 flex-row gap-2 rounded-xl bg-neutral-background-2 p-4 shadow-16"
    >
      <p class="text-lg font-semibold">Need Help?</p>
      <Link href="https://bsmg.wiki"
            target="=_blank"
            rel="no-referrer"
            class="sigma !text-lg !font-semibold"
        >Check out the Wiki!</Link
      >
    </div>
  </div>
</section>

<style>
</style>
