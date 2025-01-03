<script>
  let { src, modUrl, smallCorners } = $props();
</script>

<div
  class="flex-2 flex aspect-square rounded-[10px] bg-[#00000066] shadow-2"
  class:rounded-[6px]={smallCorners}
>
  <a href={modUrl}>
    <img
      {src}
      alt="Mod Icon"
      class="h-full rounded-[10px]"
      class:rounded-[6px]={smallCorners}
    />
  </a>
</div>
