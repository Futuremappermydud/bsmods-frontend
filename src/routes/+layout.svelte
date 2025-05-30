<script lang="ts">
  import { Spring } from "svelte/motion";
  import { onMount } from "svelte";
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";

  import { App, Button, Dialog } from "@svelte-fui/core";
  import { webLightTheme, webDarkTheme } from "@svelte-fui/themes";
  import "@svelte-fui/core/styles/root";

  import "../app.css";

  import ColorSchemeSwapper from "$lib/components/ui/color-scheme/ColorSchemeSwapper.svelte";
  import Header from "$lib/components/ui/layout/Header.svelte";
  import Footer from "$lib/components/ui/layout/Footer.svelte";
  import { MediaQuery } from "svelte/reactivity";

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  let theme = $state(webLightTheme);
  let showCursor = $state(true);

  let showPrideBanner = $state(false);
  let showPrideDialog = $state(false);

  onMount(() => {
    function handler(schemeMedia: MediaQueryListEvent) {
      theme = schemeMedia.matches ? webLightTheme : webDarkTheme;
    }

    const schemeMedia = matchMedia("(prefers-color-scheme: light)");

    schemeMedia.addEventListener("change", handler);

    let storedSettings = {
      theme: localStorage.getItem("theme"),
      showCursor: localStorage.getItem("showCursor")
    };

    if (storedSettings.theme) {
      theme = storedSettings.theme === "dark" ? webDarkTheme : webLightTheme;
    } else {
      theme = schemeMedia.matches ? webLightTheme : webDarkTheme;
    }

    if (storedSettings.showCursor) {
      showCursor = storedSettings.showCursor === "true";
    }

    if (localStorage.getItem("showPride2025Banner") === "false") {
      showPrideBanner = false;
    } else {
      if (new Date(Date.now()).getMonth() === 5 || true) { // June
        showPrideBanner = true;
      }
    }
      
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

  let isTouch = new MediaQuery("(pointer: coarse)");
</script>

<svelte:head>
  <meta property="og:title" content="BeatMods" />
  <meta
    property="og:description"
    content="A Beat Saber mod repository maintained by the Beat Saber Modding Group"
  />
  <title>BeatMods</title>
  <meta
    name="description"
    content="A Beat Saber mod repository maintained by the Beat Saber Modding Group"
  />
  <meta
    property="og:image"
    content={new URL("https://beatmods.com/images/favicon.ico").toString()}
  />
  <meta property="og:image:width" content="128" />
  <meta property="og:image:height" content="128" />
</svelte:head>

<div
  class="contents h-full"
  class:dark={theme.colorBackgroundOverlay ==
    webDarkTheme.colorBackgroundOverlay}
  class:light={theme.colorBackgroundOverlay !==
    webDarkTheme.colorBackgroundOverlay}
>
  <App {theme}>
    <div class="app overflow-y-clip bg-neutral-background-3">
      <Header
        userData={data}
        isLight={theme.colorBackgroundOverlay !==
          webDarkTheme.colorBackgroundOverlay}
      />
      {#if showPrideBanner}
      <div class="w-auto h-12">
        <div class="w-full h-full prideflag">
          <span class="font-semibold w-full h-full flex flex-row items-center justify-center gap-1 bg-black/60">
            <Button appearance="subtle" on:click={() => (showPrideDialog = true)}>
              <span class="text-white text-base">Happy pride month from the BSMG & BeatMods team.</span>
            </Button>
          </span>
        </div>
      </div>

      <Dialog.Root bind:open={showPrideDialog} type="modal">
        <Dialog.Header>
          Happy pride month from the BSMG & BeatMods team.
        </Dialog.Header>
        <Dialog.Body>
          We've been going for quite a while, 7 years can and will tire anyone out. We're not a profit-grifting corporate entity. We're people, with our own lives. Creating experiences in our spare time for you all to enjoy, and we ask that you remember that.
          <br>
          <br>
          This community has shaped many of us and how we've all individually grown as people. Whether you form a tightknit circle or are a member of a larger space, as a whole community, we've all made an impact on the lives of many. Many of us may have stopped playing or creating, but most of us have stuck around for the love of the game and each other.
          <br>
          <br>
          These tools, mods, levels and assets only exist due to the thankless work of many, with backbones of our community identifying with an LGBTQ+ label. Without us, members of the LGBTQ+ community, you wouldn't be modding the game or having the experiences you pay nothing for.
          <br>
          <br>
          Whether you're here from the start, took a break, a new player, ranked or casual, we'd like to thank all of you for shaping our community into what it is today and sticking with us.
        </Dialog.Body>

        <Dialog.Actions class="justify-end">
          <Button
            appearance="subtle"
            on:click={() => {
              //showPrideBanner = false;
              localStorage.setItem("showPride2025Banner", "false");
              //showPrideDialog = false;
              window.location.reload(); // Reload to remove fix the dialog breaking things
            }}
          >
            Hide Banner & Don't Show Again
          </Button>
          <Button
            appearance="primary"
            on:click={() => {showPrideDialog = false}}
          >
            Close
          </Button>
        </Dialog.Actions>
      </Dialog.Root>
      {/if}

      <main class="ml-4 mr-4 w-auto overflow-x-visible md:ml-10 md:mr-10">
        {@render children()}
      </main>

      <Footer />

      <div class="fixed bottom-[16px] left-[16px] aspect-square w-[32px]">
        <ColorSchemeSwapper bind:theme bind:showCursor />
      </div>
    </div>
  </App>
</div>

<svg
  class="invisible"
  class:!visible={!isTouch.current && showCursor}
  class:dim={distance < 15}
  class:dimmer={coords.current.y < 50}
  xmlns="http://www.w3.org/2000/svg"
  role="presentation"
>
  <rect
    transform="translate({coords.current.x}, {coords.current
      .y}) rotate({(rotation.current.r * 180) / Math.PI})"
    x="-10"
    y="-10"
    width="20"
    height="20"
    fill="currentColor"
    rx="4"
    ry="4"
  />
  <path
    transform="translate({coords.current.x}, {coords.current
      .y}) rotate({(rotation.current.r * 180) / Math.PI - 90})"
    fill="white"
    d="M -7 -7 V -5 L 0 -1 L 7 -5 V -7"
  />
</svg>

<!--
<svg class:dim={distance < 15} transform="translate({coords.current.x-12.5}, {coords.current.y-512+70}) rotate({(rotation.current.r * 180) / Math.PI - 90})" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <path d="M54.1,438.7H35.6C15.9,438.7,0,422.8,0,403.1V108.8c0-19.6,15.9-35.5,35.6-35.5h18.6" fill="#FC513D"/>
  <path d="M72.2,438.7H54c-19.6,0-35.6-15.9-35.6-35.5V108.8c0-19.6,15.9-35.5,35.6-35.5h18.2" fill="#FF7B4C"/>
  <path d="M90.8,438.7H72.6C53,438.7,37,422.8,37,403.2V108.8C37,89.2,53,73.3,72.6,73.3h18.2" fill="#FDA252"/>
  <path d="M108.2,438.7H90.8c-19.6,0-35.6-15.9-35.6-35.5V108.8c0-19.6,15.9-35.5,35.6-35.5h17.3" fill="#FCD956"/>
  <path d="M457.9,73.3h18.6c19.6,0,35.6,15.9,35.6,35.5v294.3c0,19.6-15.9,35.5-35.6,35.5h-18.6" fill="#4343FC"/>
  <path d="M439.8,73.3H458c19.6,0,35.6,15.9,35.6,35.5v294.3c0,19.6-15.9,35.5-35.6,35.5h-18.2" fill="#48A3FC"/>
  <path d="M421.2,73.3l18.2,0c19.6,0,35.6,15.9,35.6,35.5v294.3c0,19.6-15.9,35.5-35.6,35.5h-18.2" fill="#52E6F8"/>
  <path d="M403.5,73.3h17.7c19.6,0,35.6,15.9,35.6,35.5v294.3c0,19.6-15.9,35.5-35.6,35.5h-17.3" fill="#5EF8B2"/>
  <path d="M108.2,73.3l295.3,0c19.6,0,35.6,15.6,35.6,35.2v294.9c0,19.6-15.9,35.2-35.6,35.2H108.6 c-20.8,0-35.6-15.6-35.6-35.2V108.6C73,88.9,88.5,73.3,108.2,73.3L108.2,73.3z" fill="#fff"/>
  <circle cx="243.33" cy="264" r="83.33"/>
</svg>-->
<style>
  svg {
    color: #c81414;
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    pointer-events: none;
    z-index: 100;
    opacity: 50%;
    transition-duration: 0.4s;
  }

  .dim {
    opacity: 20%;
  }

  .dimmer {
    opacity: 0%;
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

  .prideflag {
    background-image: linear-gradient(to right, rgb(237, 34, 36), rgb(243, 91, 34), rgb(249, 150, 33), rgb(245, 193, 30), rgb(241, 235, 27) 27%, rgb(241, 235, 27), rgb(241, 235, 27) 33%, rgb(99, 199, 32), rgb(12, 155, 73), rgb(33, 135, 141), rgb(57, 84, 165), rgb(97, 55, 155), rgb(147, 40, 142))
  }
</style>
