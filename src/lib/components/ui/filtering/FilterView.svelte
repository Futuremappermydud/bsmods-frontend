<script lang="ts">
  import {
    InputSkin,
    Dropdown,
    Label,
    Input,
    Divider,
    Menu,
    Button,
    Icon,
  } from "@svelte-fui/core";
  import { FilterFilled } from "@svelte-fui/icons";
  import VersionPicker from "../versions/VersionPicker.svelte";

  //props
  let {
    selectedVersion = $bindable(),
    selectedGame = $bindable(),
    search = $bindable(),
  } = $props();
</script>

<div class="left-side flex flex-row gap-4">
  <div
    class="bg-neutral-background-2 rounded-xl shadow-8 justify-start flex flex-col flex-1 p-2 gap-3"
  >
    <div class="h-8 flex flex-row gap-2">
      <div class="search flex-1" role="searchbox">
        <Input size="lg" placeholder="Search mods" bind:value={search} />
      </div>
      <Button class="p-0 aspect-square">
        <Icon>
          <svg viewBox="0 0 20 20">
            <FilterFilled />
          </svg>
        </Icon>
        <Menu.Root>
          <Label size="lg" class="justify-center flex pt-1 pb-1">Sort</Label>
          {#each ["Alphabetical", "Author Alphabetical", "Last Updated"] as method}
            <Divider />
            <Menu.Group>
              <Menu.Item>
                <div>{method} (Ascending)</div>
              </Menu.Item>
              <Menu.Item>
                <div>{method} (Descending)</div>
              </Menu.Item>
            </Menu.Group>
          {/each}
        </Menu.Root>
      </Button>
    </div>
    <br />
    <VersionPicker
      bind:selectedVersion
      bind:selectedGame />
  </div>

  <Divider class="!flex-none" vertical={true} />
</div>

<style>
  .left-side {
    height: fit-content;
    align-content: center;
  }
</style>
