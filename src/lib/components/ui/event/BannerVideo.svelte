<script lang="ts">
  import type { Event } from "$lib/types/Events";

  let {
    event,
  }: {
    event: Event;
  } = $props();
</script>

<div class="flex aspect-video w-auto rounded-[10px] bg-[#00000066] shadow-4">
  <a href={event.url} aria-label="Extra Sensory">
    <video
      playsinline={true}
      autoplay={true}
      muted={true}
      loop={true}
      class="w-full rounded-[10px]"
      aria-label="Extra Sensory"
    >
      <source
        src={event.videoWebm}
        type="video/webm"
        aria-label="Extra Sensory"
      />
      <source
        src={event.videoMp4}
        type="video/mp4"
        aria-label="Extra Sensory"
      />
    </video>
  </a>
</div>
