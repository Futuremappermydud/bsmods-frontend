<script lang="ts">
  import { page } from "$app/state";
</script>

<section
  class="mx-10 mt-10 flex w-stretch flex-col items-center gap-28 md:mx-14"
>
  <div class="flex flex-col items-center gap-8">
    <h1 class="font-nunito text-4xl font-bold">
      Oh No! A <span class="text-red-400">{page.status}</span> Error Occurred!
    </h1>
    <h2 class="!texl-4xl text-neutral-foreground-3">Try a different page...</h2>
  </div>
</section>
