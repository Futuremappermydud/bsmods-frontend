<script>
  import { Divider } from "@svelte-fui/core";
  import { page } from "$app/stores";
  import { ArrowUploadRegular } from "@svelte-fui/icons";

  let props = $props();

  function login() {
    window.open(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/github`,
      "_self",
    );
  }

  function goToProfile() {}

  console.log(page);
</script>

<header class="flex-col">
  <div class="w-auto h-[50px] flex ml-10 mr-10">
    <div class="left">
      <img class="logo-img" src="/images/Beatmods.svg" alt="BeatMods Logo" />
    </div>
    <ul>
      <li>
        <a href="/" data-text="Home" data-selected={$page.url.pathname === "/"}
          >Home</a
        >
      </li>
      <li>
        <a
          href="/mods"
          data-text="Mods"
          data-selected={$page.url.pathname === "/mods"}>Mods</a
        >
      </li>
      <li>
        <a
          href="https://bsmg.wiki"
          target="_blank"
          rel="noopener noreferrer"
          data-text="Wiki">Wiki</a
        >
      </li>
      <li>
        <a
          href="https://discord.gg/beatsabermods"
          target="_blank"
          rel="noopener noreferrer"
          data-text="Discord">Discord</a
        >
      </li>
    </ul>
    <div class="user gap-3">
      {#if props.userData.hasAttempted}
        {#if props.userData.authenticated}
          <a class="contents" href="/upload">
            <svg class="w-4 h-4 scale-[1.6]">
              <ArrowUploadRegular />
            </svg>
          </a>
        {/if}
        <button
          class="corner-btn"
          onclick={props.userData.authenticated ? goToProfile : login}
        >
          <img
            class="corner-img"
            alt={props.userData.authenticated ? "Logged In" : "Not Logged In"}
            class:logged-in={props.userData.authenticated}
            src={props.userData.authenticated
              ? `https://github.com/${props.userData.username}.png`
              : "images/github-mark-white.svg"}
          />
        </button>
      {/if}
    </div>
  </div>
  <Divider />
</header>

<style>
  header {
    display: flex;
    height: 50px;
    margin: 5px 0px 0px 0px;
    z-index: 1;
  }

  .corner-img {
    display: flex;
    height: 100%;
    aspect-ratio: 1;
  }

  .corner-btn {
    display: flex;
    aspect-ratio: 1;
    height: 100%;
    background: none;
    border: none;
    justify-content: center;
    transition: transform 0.1s;
  }

  .logged-in {
    border-radius: 50%;
  }

  .corner-btn:hover {
    transform: scale(1.1);
    cursor: pointer;
  }

  .user {
    display: flex;
    align-items: center;
    margin: 5px;
    flex: 1;
    justify-content: right;
  }

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

  .logo-img {
    display: flex;
    height: 100%;
    aspect-ratio: 1;
  }

  a {
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
    height: 1px;
    background: var(--fui-colorBrandForegroundLinkSelected);
    color: transparent;
    transition: transform 0.1s;
  }
  a[data-selected="true"]:hover::after {
    transform: scaleX(1.2);
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
