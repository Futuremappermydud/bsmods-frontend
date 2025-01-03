<script lang="ts">
  import { Link } from "@svelte-fui/core";
</script>

<section
  class="flex flex-col gap-32 items-center w-stretch mx-10 md:mx-14 mt-10"
>
  <div class="flex flex-col items-center">
    <h1 class="text-5xl font-semibold font-rubik">
      <span class="text-beatmods-pink">Beat</span>
      <span class="text-beatmods-purple">Mods</span>
    </h1>
    <p class="mt-2 text-center">
      A Beat Saber mod repository maintained by the Beat Saber Modding Group
    </p>
  </div>
  <div class="flex flex-col gap-8 pb-4">
    <div class="flex flex-col lg:flex-row gap-8 w-full">
      <div
        class="flex-1 w-full aspect-square flex flex-col items-center shadow-16 bg-neutral-background-2 rounded-xl p-4"
      >
        <h2 class="font-semibold text-xl">Discover</h2>
        <h3 class="text-sm text-neutral-foreground-2 text-center">
          Find mods that suit you best.
        </h3>
      </div>
      <div
        class="flex-1 w-full aspect-square flex flex-col items-center shadow-16 bg-neutral-background-2 rounded-xl p-4"
      >
        <h2 class="font-semibold text-xl">Create</h2>
        <h3 class="text-sm text-neutral-foreground-2 text-center">
          Upload and create your own mods for the community.
        </h3>
        <div class="flex-1 flex flex-col gap-4 w-stretch mt-8">
          <a
            href="https://bsmg.wiki/modding/"
            target="=_blank"
            class="flex-1 flex justify-center items-center bg-green-400 hover:bg-green-500 dark:bg-green-800 hover:dark:bg-green-700 transition-colors duration-100 p-2 rounded-lg shadow-4"
          >
            <p class="font-semibold">Mod Creation Guide</p>
          </a>
          <a
            class:opacity-40={true}
            class:pointer-events-none={true}
            href="/upload"
            class="flex-1 flex justify-center items-center bg-brand-teams-80 hover:bg-brand-teams-90 transition-colors duration-100 p-2 rounded-lg shadow-4"
          >
            <p class="font-semibold">Upload a Mod (Coming Soon)</p>
          </a>
        </div>
      </div>
      <div
        class="flex-1 w-full aspect-square flex flex-col items-center shadow-16 bg-neutral-background-2 rounded-xl p-4"
      >
        <h2 class="font-semibold text-xl">Manage</h2>
        <h3 class="text-sm text-neutral-foreground-2 text-center">
          Use a Beatmods-compatible mod manager to seamlessly manage your mods.
        </h3>
        <div class="flex-1 flex flex-col gap-4 w-stretch mt-8">
          <a
            href="https://www.bsmanager.io/"
            target="=_blank"
            class="flex-1 flex justify-center items-center bg-brand-web-80 hover:bg-brand-web-90 transition-colors duration-100 p-2 rounded-lg shadow-4"
          >
            <p class="font-semibold">
              BSManager <span class="text-sm text-yellow-200"
                >(★ Recommended)</span
              >
            </p>
          </a>
          <a
            href="https://github.com/Assistant/ModAssistant/releases/latest"
            target="=_blank"
            class="flex-1 flex justify-center items-center bg-red-600 hover:bg-red-500 transition-colors duration-100 p-2 rounded-lg shadow-4"
          >
            <p class="font-semibold">Mod Assistant (Legacy)</p>
          </a>
          <a
            href="https://example.com"
            target="=_blank"
            aria-disabled={true}
            class="flex-1 flex justify-center items-center bg-moddingpink-signaturePink p-2 rounded-lg shadow-4 opacity-40 pointer-events-none"
          >
            <p class="font-semibold">PinkModManager (WIP)</p>
          </a>
        </div>
      </div>
    </div>
    <div
      class="flex-1 flex flex-row gap-2 w-full h-fit shadow-16 bg-neutral-background-2 rounded-xl p-4"
    >
      <p class="text-lg font-semibold">Need Help?</p>
      <Link href="https://bsmg.wiki" class="sigma !text-lg !font-semibold"
        >Check out the Wiki!</Link
      >
    </div>
  </div>
</section>

<style>
</style>
