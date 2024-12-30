<script lang="ts">
</script>

<section class="flex flex-col gap-48 items-center w-stretch mx-20 mt-10">
  <div class="flex flex-col items-center">
    <h1 class="text-5xl font-semibold">
      <span class="text-beatmods-pink">Beat</span><span
        class="text-beatmods-purple">Mods</span
      >
    </h1>
    <p class="mt-2">
      A Beat Saber mod repository maintained by the Beat Saber Modding Group
    </p>
  </div>
  <div class="flex flex-row gap-16 w-full">
    <div
      class="flex-1 w-full aspect-square flex flex-col items-center shadow-16 bg-neutral-background-2 rounded-xl p-4"
    >
      <h2 class="font-semibold text-xl">Discover</h2>
    </div>
    <div
      class="flex-1 w-full aspect-square flex flex-col items-center shadow-16 bg-neutral-background-2 rounded-xl p-4"
    >
      <h2 class="font-semibold text-xl">Create</h2>
    </div>
    <div
      class="flex-1 w-full aspect-square flex flex-col items-center shadow-16 bg-neutral-background-2 rounded-xl p-4"
    >
      <h2 class="font-semibold text-xl">Manage</h2>
      <h3 class="text-sm text-neutral-foreground-2 text-center">
        Use a Beatmods compatible mod manager to seamlessly manage your mods.
      </h3>
      <div class="flex-1 flex flex-col gap-2 w-stretch mt-8">
        <a
          href="https://www.bsmanager.io/"
          class="flex-1 flex justify-center items-center bg-brand-web-80 hover:bg-brand-web-90 transition-colors duration-100 p-2 rounded-lg shadow-4"
        >
          <p>
            BSManager <span class="text-sm text-yellow-200"
              >(★ Recommended)</span
            >
          </p>
        </a>
        <a
          href="https://github.com/Assistant/ModAssistant/releases/latest"
          class="flex-1 flex justify-center items-center bg-brand-office-90 hover:bg-brand-office-100 transition-colors duration-100 p-2 rounded-lg shadow-4"
        >
          <p>Mod Assistant</p>
        </a>
        <a
          href="https://example.com"
          aria-disabled={true}
          class="flex-1 flex justify-center items-center bg-brand-teams-80 p-2 rounded-lg shadow-4 opacity-40 pointer-events-none"
        >
          Pink Mod Manager (WIP)
        </a>
      </div>
    </div>
  </div>
</section>

<style>
</style>
