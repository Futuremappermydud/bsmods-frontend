<script>
  let props = $props();

  function login() {
    window.open(`${import.meta.env.VITE_API_BASE_URL}/api/auth/github`, "_self");
  }

  function goToProfile() {}
</script>

<header>
  <div class="left">
    <img class="logo-img" src="/images/Beatmods.svg" alt="BeatMods Logo" />
    <p class="logo-txt primary">Beat</p>
    <p class="logo-txt secondary">Mods</p>
  </div>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/mods">Mods</a></li>
    <li>
      <a href="https://bsmg.wiki" target="_blank" rel="noopener noreferrer"
        >Wiki</a
      >
    </li>
    <li>
      <a
        href="https://discord.gg/beatsabermods"
        target="_blank"
        rel="noopener noreferrer">Discord</a
      >
    </li>
  </ul>
  <div class="user">
    {#if props.userData.hasAttempted}
      {#if props.userData.authenticated}{/if}
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
</header>

<style>
  header {
    display: flex;
    height: 50px;
    margin: 5px 40px 0px 40px;
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
    color: white;
    text-decoration: none;
    padding: 10px 10px 0px 10px;
    width: 100%;
    height: 100%;
  }

  .logo-txt {
    display: flex;
  }

  .primary {
    color: #662d91;
  }

  .secondary {
    color: #92278f;
  }
</style>
