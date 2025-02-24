<script lang="ts">
    import type { Snippet } from 'svelte'
    import { Button } from "@svelte-fui/core";
    import { appendURL } from "$lib/utils/url";
    import AdminActionCard from "./AdminActionCard.svelte";
    import TextArea from "../textarea/TextArea.svelte";
    import GameVersionPicker from '../filtering/GameVersionPicker.svelte';
    import GamePicker from '../filtering/GamePicker.svelte';
    import { derived } from 'svelte/store';
    import type { Versions } from '$lib/types/Versions';

    let createBody = $state({
        gameName: "",
        version: ""
    });
    let allVersions:Versions = $state({versions: []});

    let selectedGame = $state("");
    let selectedVersion = $state("");
    let defaultBody = $derived.by(() => {
        return {
            gameVersionId: allVersions.versions.find(version => version.gameName === selectedGame && version.version == selectedVersion)?.id
        };
    });
</script>

{#snippet create()}
<div class="flex flex-row gap-4 m-2 justify-center">
    <p class="text-l pt-2 text-neutral-foreground-3">Game Name:</p>
    <TextArea bind:value={createBody.gameName}/>
</div>
<div class="flex flex-row gap-4 justify-center">
    <p class="text-l pt-2 text-neutral-foreground-3">Version:</p>
    <TextArea bind:value={createBody.version} />
</div>
{/snippet}

{#snippet setDefault()}
    <GamePicker bind:selectedGame={selectedGame} required/>
    <div class="h-2"></div>
    <GameVersionPicker 
        bind:allVersions={allVersions}
        bind:selectedVersion={selectedVersion} 
        bind:selectedGame={selectedGame}
    />
{/snippet}

<div class="flex flex-row flex-wrap gap-4 m-xxxl items-center justify-center">
<AdminActionCard
    title="Add Game Version"
    description="Adds a Game Version to the database. This is something that must be done before mods can be uploaded for that version."
    buttonText="Add Version"
    slot={create}
    buttonUrl={appendURL("api/versions")}
    reqBody={createBody}
/>
<AdminActionCard
    title="Set Default Game Version"
    description="Sets the default Game Version for the server. This is the version that will be selected by default when uploading a mod."
    buttonText="Set Default"
    slot={setDefault}
    reqBody={defaultBody}
    buttonUrl={appendURL("api/versions/default")}
/>
</div>