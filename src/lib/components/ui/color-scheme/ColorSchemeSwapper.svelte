<script lang="ts">
  import { Button, Icon, Menu } from "@svelte-fui/core";
  import { WeatherSunnyRegular, WeatherMoonRegular } from "@svelte-fui/icons";
  import { webLightTheme, webDarkTheme } from "@svelte-fui/themes";

  //props
  let { theme = $bindable(webLightTheme), showCursor = $bindable(true) } =
    $props();
</script>

<Button class="aspect-square h-full w-full rounded-xl p-0">
  <Icon>
    <svg viewBox="0 0 20 20">
      {#if theme.colorBackgroundOverlay == webDarkTheme.colorBackgroundOverlay}
        <WeatherMoonRegular />
      {:else}
        <WeatherSunnyRegular />
      {/if}
    </svg>
  </Icon>
  <Menu.Root>
    <Menu.Group class="p-2">
      <Menu.Item
        on:click={() => {
          theme = webLightTheme;
        }}
      >
        <div>Light</div>
      </Menu.Item>
      <Menu.Item
        on:click={() => {
          theme = webDarkTheme;
        }}
      >
        <div>Dark</div>
      </Menu.Item>
      <Menu.Item
        on:click={() => {
          showCursor = !showCursor;
        }}
      >
        <div>Toggle Block Cursor</div>
      </Menu.Item>
    </Menu.Group>
  </Menu.Root>
</Button>
