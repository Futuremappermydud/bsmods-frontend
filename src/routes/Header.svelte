<script lang="ts">
  import { Divider } from "@svelte-fui/core";
  import { page } from "$app/stores";
  import { ArrowUploadRegular, ColorLineRegular } from "@svelte-fui/icons";
  import { checkUserAnyGame, UserRoles } from "$lib/types/UserRoles";
  import type { AuthedUser } from "$lib/types/AuthedUser";

  let { userData, isLight }: { userData: AuthedUser; isLight: Boolean } =
    $props();

  function login() {
    window.open(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/github?redirect=`,
      "_self",
    );
  }

  function goToProfile() {
    window.open(`/user/${userData.userId}`, "_self");
  }

  console.log(page);
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

<header class="flex flex-col h-12 mt-1 z-10">
  <div class="w-auto h-[50px] flex ml-10 mr-10">
    <div class="flex h-auto flex-1 left">
      <a class="h-full aspect-square" href="/">
        <img class="h-auto" src="/images/Beatmods.svg" alt="BeatMods Logo" />
      </a>
    </div>
    <ul>
      {@render navItems()}
    </ul>
    <div class="flex-1 items-center m-1 justify-end gap-3">
      {#if userData.hasAttempted}
        {#if userData.authenticated && import.meta.env.DEV}
          <a class="contents" href="/approval">
            <svg class="w-6 h-6" viewBox="0 0 20 20">
              <ColorLineRegular />
            </svg>
          </a>
          {#if userData.roles && checkUserAnyGame(userData.roles, UserRoles.Approver)}
            <a class="contents" href="/upload">
              <svg class="w-6 h-6" viewBox="0 0 20 20">
                <ArrowUploadRegular />
              </svg>
            </a>
          {/if}
        {/if}
        <button
          class="flex float-right aspect-square h-full bg-none border-non justify-center transition-transform duration-100 hover:scale-110 hover:cursor-pointer"
          onclick={userData.authenticated ? goToProfile : login}
        >
          <img
            class="flex h-full aspect-square"
            alt={userData.authenticated ? "Logged In" : "Not Logged In"}
            class:rounded-circular={userData.authenticated}
            src={userData.authenticated
              ? `https://github.com/${userData.username}.png`
              : isLight
                ? "/images/github-mark.svg"
                : "/images/github-mark-white.svg"}
          />
        </button>
      {/if}
    </div>
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
