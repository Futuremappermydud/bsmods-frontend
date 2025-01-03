<script lang="ts">
  import { Button, Divider, Menu } from "@svelte-fui/core";
  import { page } from "$app/stores";
  import {
    ArrowUploadRegular,
    ColorLineRegular,
    NavigationRegular,
  } from "@svelte-fui/icons";
  import { checkUserAnyGame, UserRoles } from "$lib/types/UserRoles";
  import type { AuthedUser } from "$lib/types/AuthedUser";
  import { appendURL } from "$lib/utils/url";
  import { MediaQuery } from "svelte/reactivity";

  let { userData, isLight }: { userData: AuthedUser; isLight: Boolean } =
    $props();

  function login() {
    window.open(
      appendURL(
        `api/auth/github?redirect=${encodeURIComponent(window.location.origin)}`,
      ),
      "_self",
    );
  }

  function goToProfile() {
    window.open(`/user/${userData.userId}`, "_self");
  }

  let isDesktop = new MediaQuery("min-width: 700px");
</script>

{#snippet navItems()}
  <li>
    <a
      class="nav"
      href="/"
      data-text="Home"
      data-selected={$page.url.pathname === "/"}>Home</a
    >
  </li>
  <li>
    <a
      class="nav"
      href="/mods"
      data-text="Mods"
      data-selected={$page.url.pathname === "/mods"}>Mods</a
    >
  </li>
  <li>
    <a
      class="nav"
      href="https://bsmg.wiki"
      target="_blank"
      rel="noopener noreferrer"
      data-text="Wiki">Wiki</a
    >
  </li>
  <li>
    <a
      class="nav"
      href="https://discord.gg/beatsabermods"
      target="_blank"
      rel="noopener noreferrer"
      data-text="Discord">Discord</a
    >
  </li>
{/snippet}

{#snippet rightItems()}
  {#if userData.hasAttempted}
    {#if userData.authenticated && import.meta.env.DEV}
      {#if userData.roles && checkUserAnyGame(userData.roles, UserRoles.Approver)}
        <a class="contents" href="/approval">
          <svg class="w-6 h-6" viewBox="0 0 20 20">
            <ColorLineRegular />
          </svg>
        </a>
      {/if}
      <a class="contents" href="/upload">
        <svg class="w-6 h-6" viewBox="0 0 20 20">
          <ArrowUploadRegular />
        </svg>
      </a>
    {/if}
    {#if userData.authenticated}
      <button
        class="flex float-right aspect-square h-full bg-none border-non justify-center transition-transform duration-100 hover:scale-110 hover:cursor-pointer"
        onclick={goToProfile}
      >
        <img
          class="flex h-full aspect-square rounded-circular"
          alt="Logged In"
          src="https://github.com/{userData.username}.png"
        />
      </button>
    {:else}
      <Button onclick={login}>Sign in with GitHub</Button>
    {/if}
  {/if}
{/snippet}

<header class="flex flex-col h-[50px] mt-1 z-10 gap-1">
  <div class="w-auto flex h-full ml-10 mr-10">
    <div class="flex h-auto flex-1 left">
      <a class="h-full aspect-square" href="/">
        <img class="h-auto" src="/images/Beatmods.svg" alt="BeatMods Logo" />
      </a>
    </div>
    {#if isDesktop.current}
      <ul>
        {@render navItems()}
      </ul>
      <div class="flex flex-1 justify-end py-1 gap-2 items-center">
        {@render rightItems()}
      </div>
    {:else}
      <div class="flex flex-1">
        <button
          class="ml-auto shadow-2 bg-neutral-background-1 text-neutral-foreground-1 flex aspect-square h-10 items-center justify-center rounded-xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <NavigationRegular />
          </svg>

          <Menu.Root class="flex flex-col px-4 py-2 my-1">
            <ul class="flex flex-col !gap-0">
              {@render navItems()}
            </ul>
            <div class="w-10 mx-auto my-2">
              {@render rightItems()}
            </div>
          </Menu.Root>
        </button>
      </div>
    {/if}
  </div>
  <Divider />
</header>

<style>
  li {
    display: flex;
    flex: 1;
    justify-content: center;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .left {
    display: flex;
    align-items: center;
    margin: 5px;
    flex: 1;
  }

  ul {
    display: flex;
    gap: 40px;
    padding: 0;
    flex: 1;
    align-items: center;
    justify-content: center;
    margin: 0;
  }

  a.nav {
    text-decoration: none;
    padding: 10px 10px 0px 10px;
    width: 100%;
    height: 100%;
    transition: transform 0.3s;

    transition: color 0.2s;
  }

  a:hover {
    transform: translateY(-1px);
  }

  a[data-selected="true"] {
    color: var(--fui-colorBrandForegroundLinkSelected);
  }

  a[data-selected="true"]::after {
    content: attr(data-text);
    display: block;
    font-family: inherit;
    font-size: inherit;
    width: fit-content;
    height: 3px;
    border-radius: 1000px;
    background: var(--fui-colorBrandForegroundLinkSelected);
    color: transparent;
    transition: transform 0.1s;
  }
  a[data-selected="true"]:hover::after {
    transform: scaleX(1.2) scaleY(0.5);
  }

  a:not([data-selected="true"])::after {
    content: attr(data-text);
    display: block;
    font-family: inherit;
    font-size: inherit;
    width: fit-content;
    height: 1px;
    background: var(--fui-colorNeutralForeground1);
    color: transparent;
    transform: scaleX(0);
    transition: transform 0.1s;
  }
  a:not([data-selected="true"]):hover::after {
    transform: scaleX(0.5);
    background: var(--fui-colorBrandForegroundLinkHover);
  }

  a:not([data-selected="true"]):hover {
    color: var(--fui-colorBrandForegroundLinkHover);
  }
</style>
