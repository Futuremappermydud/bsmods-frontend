<script>
  import { onMount } from "svelte";
  import Header from "./Header.svelte";
  import "../app.css";

  import { App, Button } from "@svelte-fui/core";
  import { webLightTheme, webDarkTheme } from "@svelte-fui/themes";
  import "@svelte-fui/core/styles/root";

  let { children } = $props();

  let userData = $state({
    hasAttempted: false,
    authenticated: false,
    username: "Guest",
    userId: -1,
  });

  onMount(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Not authenticated");
      let data = await response.json();
      userData = {
        hasAttempted: true,
        authenticated: true,
        username: data.username,
        userId: data.userId,
      };
    } catch (error) {
      userData = {
        hasAttempted: true,
        authenticated: false,
        username: "Guest",
        userId: -1,
      };
    }
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

<App theme={webDarkTheme}>
  <div class="app">
    <Header {userData} />

    <main class="mr-10 ml-10 w-auto">
      {@render children()}
    </main>
  </div>
</App>

<style>
  .app {
    font-family: "Poppins", serif !important;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .app::before {
    width: 100%;
    content: " ";
    position: fixed;
    height: 100%;
    background-image: url("/images/noise.svg");
    opacity: 0.6;
    mix-blend-mode: overlay;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    height: 100%;
    box-sizing: border-box;
  }
</style>
