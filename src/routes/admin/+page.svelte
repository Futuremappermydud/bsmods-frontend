<script lang="ts">
    import GameVersionManagement from "$lib/components/ui/admin/GameVersionManagement.svelte";
    import OneShots from "$lib/components/ui/admin/OneShots.svelte";
    import UserManagement from "$lib/components/ui/admin/UserManagement.svelte";
    import Tab from "$lib/components/ui/tablist/Tab.svelte";
    import TabList from "$lib/components/ui/tablist/TabList.svelte";
    import { checkUserAnyGame, UserRoles } from "$lib/types/UserRoles";
    import { getStatus, type ServerStatus } from "$lib/utils/status";
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import { Link } from "@svelte-fui/core";

    let { data }: { data: PageData } = $props();

    let serverStatus:ServerStatus|undefined = $state();

    onMount(async () => {
        serverStatus = await getStatus();
    });

    let isAuthorized = $derived.by(() => {
        if (!data || !data.roles) return false;

        if (isAdmin || isApprover) {
            return true;
        } else {
            return false;
        }
    });

    let isAdmin = $derived.by(() => {
        if (!data || !data.roles) return false;

        if (checkUserAnyGame(data.roles, UserRoles.Admin)) {
            return true;
        } else {
            return false;
        }
    });

    let isApprover = $derived.by(() => {
        if (!data || !data.roles) return false;

        if (checkUserAnyGame(data.roles, UserRoles.Approver)) {
            return true;
        } else {
            return false;
        }
    });

    let page = $state("os");
</script>

<div class="flex flex-col items-center gap-4 text-center">
    {#if isAuthorized}
        <div class="bg-neutral-background-2 rounded-lg p-4">
            <h1 class="text-3xl">Status</h1>
            <p>Frontend: <Link target="_blank" href="https://github.com/Futuremappermydud/bsmods-frontend/commit/{serverStatus?.frontend.gitVersion}">{serverStatus?.frontend.gitVersion}</Link> | Backend: ({serverStatus?.httpCode}) <Link target="_blank" href="https://github.com/Saeraphinx/BadBeatMods/commit/{serverStatus?.backend.gitVersion}">{serverStatus?.backend.gitVersion}</Link><br>
            {serverStatus?.backend.veryImportantMessage}</p>
        </div>
        <TabList disabled={false} layout="horizontal" bind:value={page}>
            {#if isAdmin}
                <Tab value="os">One Shots</Tab>
            {/if}
            {#if isApprover}
                <Tab value="users">User Management</Tab>
            {/if}
            {#if isAdmin}
                <Tab value="gv">Game Version Management</Tab>
            {/if}
        </TabList>

        {#if page === "users"}
            <UserManagement />
        {:else if page === "gv"}
            <GameVersionManagement />
        {:else if page === "os"}
            <OneShots />
        {/if}
    {:else}
        <p>You are not authorized to view this page.</p>
    {/if}
</div>