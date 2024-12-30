<script lang="ts">
  import { Spring } from "svelte/motion";
  import { onMount } from "svelte";
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";

  import { App } from "@svelte-fui/core";
  import { webLightTheme, webDarkTheme } from "@svelte-fui/themes";
  import "@svelte-fui/core/styles/root";

  import "../app.css";

  import ColorSchemeSwapper from "$lib/components/ui/color-scheme/ColorSchemeSwapper.svelte";
  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";

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

  let coords = new Spring(
    { x: 500, y: 500 },
    {
      stiffness: 0.2,
      damping: 0.7,
    },
  );

  let rotation = new Spring(
    { r: 0 },
    {
      stiffness: 0.2,
      damping: 0.7,
    },
  );

  function smoothAtan2(y: number, x: number) {
    const angle = Math.atan2(y, x);

    if (rotation.target.r === null) {
      rotation.target.r = angle;
      return angle;
    }

    // Ensure smooth transition by unwrapping the angle
    const delta = angle - rotation.target.r;
    const unwrappedDelta =
      delta - Math.round(delta / (2 * Math.PI)) * (2 * Math.PI);

    rotation.target.r += unwrappedDelta;
    return rotation.target.r;
  }

  let distance = $derived(
    Math.sqrt(
      (coords.current.x - coords.target.x) ** 2 +
        (coords.current.y - coords.target.y) ** 2,
    ),
  );

  function animate(e: MouseEvent) {
    coords.target = { x: e.clientX, y: e.clientY };
    rotation.target = {
      r: smoothAtan2(
        coords.current.y - coords.target.y,
        coords.current.x - coords.target.x,
      ),
    };
  }

  onMount(() => {
    document.addEventListener("mousemove", animate, false);
    document.addEventListener("mouseenter", animate, false);
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

<div
  class="contents"
  class:dark={theme.colorBackgroundOverlay ==
    webDarkTheme.colorBackgroundOverlay}
  class:light={theme.colorBackgroundOverlay !==
    webDarkTheme.colorBackgroundOverlay}
>
  <App {theme}>
    <div class="app bg-neutral-background-3 overflow-y-clip">
      <Header userData={data} />

      <main
        class="mr-4 ml-4 md:mr-10 md:ml-10 w-auto overflow-y-scroll overflow-x-visible"
      >
        {@render children()}
      </main>

      <Footer />

      <div class="w-[32px] aspect-square fixed bottom-[16px] left-[16px]">
        <ColorSchemeSwapper bind:theme />
      </div>
    </div>
  </App>
</div>

<svg xmlns="http://www.w3.org/2000/svg" role="presentation">
  <rect
    class:dim={distance < 15}
    transform="translate({coords.current.x}, {coords.current
      .y}) rotate({(rotation.current.r * 180) / Math.PI})"
    x="-12.5"
    y="-12.5"
    width="25"
    height="25"
    fill="currentColor"
    rx="6"
    ry="6"
  />
  <path
    class:dim={distance < 15}
    transform="translate({coords.current.x}, {coords.current
      .y}) rotate({(rotation.current.r * 180) / Math.PI - 90})"
    fill="white"
    d="M -9 -8 V -4 L 0 0 L 9 -4 V -8"
  />
</svg>

<style>
  svg {
    color: #c81414;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    pointer-events: none;
    z-index: 100;
  }

  rect,
  path {
    transition: opacity;
    transition-duration: 0.2s;
  }

  .dim {
    opacity: 20%;
  }

  .dark {
    color-scheme: dark;
  }

  .light {
    color-scheme: light;
  }
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
