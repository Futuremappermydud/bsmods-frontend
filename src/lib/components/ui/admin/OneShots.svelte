<script lang="ts">
    import type { Snippet } from 'svelte'
    import { Button } from "@svelte-fui/core";
    import { appendURL } from "$lib/utils/url";
    import AdminActionCard from "./AdminActionCard.svelte";
    import TextArea from "../textarea/TextArea.svelte";
</script>

<div class="flex flex-row flex-wrap gap-4 m-xxxl items-center justify-center">
<AdminActionCard
    title="Calcuate File Size for Mods"
    description="Searches the database for Mod Versions with no file size (set to 0 within the database) and calculates the file size for them."
    buttonText="Execute"
    buttonUrl={appendURL("api/admin/database/loadBlankFileSizes")}
/>
<AdminActionCard
    title="Sort Game Versions on Mod Versions"
    description="Goes through all Mod Versions on the server and sorts the supportedGameVersionIds array by passing that Game Version's version property into SemVer's coerce & compare functions. This is the same process that occurs when a Mod Version is created or updated, and when a call to /versions is preformed."
    buttonText="Execute"
    buttonUrl={appendURL("api/admin/sortGameVersions")}
/>
</div>