<script lang="ts">
  import { onMount } from "svelte";
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";

  import { App } from "@svelte-fui/core";
  import { webLightTheme, webDarkTheme } from "@svelte-fui/themes";
  import "@svelte-fui/core/styles/root";

  import "../app.css";

  import ColorSchemeSwapper from "$lib/components/ui/color-scheme/ColorSchemeSwapper.svelte";
  import Header from "./Header.svelte";

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  let theme = $state(webLightTheme);

  onMount(() => {
    function handler(schemeMedia: MediaQueryListEvent) {
      theme = schemeMedia.matches ? webLightTheme : webDarkTheme;
    }

    const schemeMedia = matchMedia("(prefers-color-scheme: light)");

    schemeMedia.addEventListener("change", handler);

    theme = schemeMedia.matches ? webLightTheme : webDarkTheme;

    return () => {
      schemeMedia.removeEventListener("change", handler);
    };
  });
</script>

<svelte:head>
  <title>BeatMods</title>
  <meta
    name="description"
    content="This is where the description goes for SEO"
  />
  <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
</svelte:head>

<App {theme}>
  <div class="app bg-neutral-background-3">
    <Header userData={data} />

    <main class="mr-10 ml-10 w-auto">
      {@render children()}
    </main>

    <div class="w-8 h-8 fixed bottom-2 left-2">
      <ColorSchemeSwapper bind:theme />
    </div>
  </div>
</App>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-top: 1rem;
    height: 100%;
    box-sizing: border-box;
  }
</style>
