<script lang="ts">
  import EventCard from "$lib/components/ui/event/EventCard.svelte";
  import type { EventList } from "$lib/types/Events";
  import events from "./events.json";

  let allEvents: EventList = events;
</script>

<div class="mt-12 flex flex-col items-center gap-8">
  <h1 class="font-nunito text-4xl font-semibold">Events</h1>
  <div class="flex w-full flex-col items-center gap-4">
    {#each allEvents.events as event}
      <EventCard {event} />
    {/each}
  </div>
</div>
