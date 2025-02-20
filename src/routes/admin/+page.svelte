<script lang="ts">
    import GameVersionManagement from "$lib/components/ui/admin/GameVersionManagement.svelte";
    import OneShots from "$lib/components/ui/admin/OneShots.svelte";
    import Tab from "$lib/components/ui/tablist/Tab.svelte";
    import TabList from "$lib/components/ui/tablist/TabList.svelte";
    import { UserRoles } from "$lib/types/UserRoles";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

    let isAuthorized = $derived.by(() => {
        if (!data || !data.roles) return false;

        if (data.roles.sitewide.includes(UserRoles.Admin) || data.roles.sitewide.includes(UserRoles.AllPermissions)) {
            return true;
        } else {
            return false;
        }
    });
    let page = $state("os");
</script>

<div class="flex flex-col items-center gap-4 text-center">
    {#if isAuthorized}
        <TabList disabled={false} layout="horizontal" bind:value={page}>
            <Tab value="os">One Shots</Tab>
            <Tab value="users">User Management</Tab>
            <Tab value="gv">Game Version Management</Tab>
        </TabList>

        {#if page === "users"}
            <!--<UserManagement />-->
        {:else if page === "gv"}
            <GameVersionManagement />
        {:else if page === "os"}
            <OneShots />
        {/if}
    {:else}
        <p>You are not authorized to view this page.</p>
    {/if}
</div>