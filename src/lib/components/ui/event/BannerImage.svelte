<script lang="ts">
  import type { Event } from "$lib/types/Events";

  let {
    event,
  }: {
    event: Event;
  } = $props();
</script>

<div class="flex-2 flex aspect-square rounded-[10px] bg-[#00000066] shadow-2">
  <a href={event.url} target="=_blank" rel="no-referrer">
    <img src={event.image} alt="Event Banner" class="h-full rounded-[10px]" />
  </a>
</div>
