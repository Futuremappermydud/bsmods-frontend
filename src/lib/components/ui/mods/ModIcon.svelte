<script>
  let { src, modUrl } = $props();
</script>

<div class="aspect-square flex flex-2 rounded-[10px] bg-[#00000066] shadow-2">
  <a href={modUrl}>
    <img {src} alt="Mod Icon" class="h-full rounded-[10px]" />
  </a>
</div>
