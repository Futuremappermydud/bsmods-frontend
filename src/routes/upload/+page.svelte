<script lang="ts">
  import NewProject from "$lib/components/ui/upload/NewProject.svelte";
</script>

<div class="flex flex-col items-center gap-4 text-center">
  <p
    class="absolute left-4 top-16 text-lg font-semibold text-neutral-foreground-4"
  >
    Upload Mod
  </p>

  <NewProject />
</div>

<style>
  :global(.fui-field) {
    width: 100%;
    height: 100%;
    display: flex !important;
    flex-direction: column;
  }

  :global(.fui-field > label) {
    margin-right: auto;
  }
</style>
