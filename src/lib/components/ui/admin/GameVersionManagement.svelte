<script lang="ts">
    import type { Snippet } from 'svelte'
    import { Button } from "@svelte-fui/core";
    import { appendURL } from "$lib/utils/url";
    import AdminActionCard from "./AdminActionCard.svelte";
    import TextArea from "../textarea/TextArea.svelte";

    let createBody = $state({
        gameName: "",
        version: ""
    });
</script>

{#snippet create()}
<div class="flex flex-row gap-4 justify-center">
    <p class="text-l pt-2 text-neutral-foreground-3">Game Name:</p>
    <TextArea bind:value={createBody.gameName}/>
</div>
<div class="flex flex-row gap-4 justify-center">
    <p class="text-l pt-2 text-neutral-foreground-3">Version:</p>
    <TextArea bind:value={createBody.version} />
</div>
{/snippet}

<div class="flex flex-row flex-wrap gap-4 m-xxxl items-center justify-center">
<AdminActionCard
    title="Add Game Version"
    description="Adds a Game Version to the database. This is something that must be done before mods can be uploaded for that version."
    buttonText="Add Version"
    slot={create}
    buttonUrl={appendURL("api/versions")}
/>
</div>