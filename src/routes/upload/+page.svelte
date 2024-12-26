<script lang="ts">
  import NewProject from "$lib/components/ui/upload/NewProject.svelte";
</script>

<div class="flex gap-4 flex-col text-center items-center">
  <p
    class="text-lg font-semibold text-neutral-foreground-4 absolute top-16 left-4"
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
