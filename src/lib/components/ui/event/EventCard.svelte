<script lang="ts">
  import BannerVideo from "./BannerVideo.svelte";
  import BannerImage from "./BannerImage.svelte";
  import type { Event } from "$lib/types/Events";
  import { Button, Link } from "@svelte-fui/core";
  import { SvelteDate } from "svelte/reactivity";

  let {
    event,
  }: {
    event: Event;
  } = $props();

  let date = new SvelteDate();

  let timeLeft = $derived(event.time - date.getTime());

  let niceString = $derived.by(() => {
    if (timeLeft < 0) {
      return "LIVE NOW";
    } else {
      let days: number = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      let hours: number = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      let minutes: number = Math.floor(
        (timeLeft % (1000 * 60 * 60)) / (1000 * 60),
      );
      let seconds: number = Math.floor((timeLeft % (1000 * 60)) / 1000);

      let parts: string[] = [];

      if (days > 0) {
        parts.push(`${days}`);
        if (days > 1) {
          parts.push("days");
        } else {
          parts.push("day");
        }
      }

      if (hours > 0 || days !== 0) {
        parts.push(`${hours}`);
        if (hours > 1 || hours === 0) {
          parts.push("hours");
        } else {
          parts.push("hour");
        }
      }

      if (minutes > 0 || hours !== 0) {
        parts.push(`${minutes}`);
        if (minutes > 1 || minutes === 0) {
          parts.push("minutes");
        } else {
          parts.push("minute");
        }
      }

      if (seconds > 0 || minutes !== 0) {
        parts.push(`${seconds}`);
        if (seconds > 1 || seconds === 0) {
          parts.push("seconds");
        } else {
          parts.push("second");
        }
      }

      return parts.join(" ");
    }
  });

  $effect(() => {
    const interval = setInterval(() => {
      date.setTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });
</script>

<div class="w-auto min-w-min max-w-[300px] md:min-w-[700px] md:max-w-[1000px]">
  <div
    class="relative flex h-fit flex-col gap-4 overflow-clip rounded-[17.5px] border-[1px] border-solid border-purple-500 border-opacity-30 bg-neutral-background-2 p-[7.5px] shadow-4 md:h-[120px] md:cursor-default md:flex-row md:gap-2"
  >
    <div class="aspect-video h-auto">
      {#if event.bannerType === "video"}
        <BannerVideo {event} />
      {:else}
        <BannerImage {event} />
      {/if}
    </div>
    <div class="flex h-fit flex-grow flex-col gap-3">
      <div class="flex flex-grow flex-row">
        <div class="flex h-fit w-fit flex-1 flex-row gap-1 md:mt-1">
          <Link
            href={event.url}
            class="!text-lg font-semibold leading-5 md:!text-xl"
            >{event.name}</Link
          >
          <span class="mb-0.5 mt-auto h-fit text-xs text-neutral-foreground-2"
            >By {event.organizer}</span
          >
        </div>
      </div>
      <div
        class="h-12 w-auto content-center items-center rounded border-2 border-solid border-neutral-foreground-4 border-opacity-45 bg-neutral-background-3 p-2 md:w-fit"
      >
        <p class="text-center md:w-fit">{niceString}</p>
      </div>
    </div>
    {#if event.linkedMods}
      <div class="flex h-auto w-fit flex-row items-center gap-2 md:flex-col">
        <p>Mods</p>
        <div class="flex h-auto flex-grow flex-row gap-2 md:flex-col">
          {#each event.linkedMods as mod}
            <Button
              class="disabled fds-button flex-grow"
              href="/mods/{mod.id}"
              disabled={!mod.available}>{mod.name}</Button
            >
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>
