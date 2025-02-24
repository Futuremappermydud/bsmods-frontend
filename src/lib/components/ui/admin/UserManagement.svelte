<script lang="ts">
    import { Field, Input, Button, Dialog, Radio, RadioGroup } from "@svelte-fui/core";
    import CategoryDropdown from "../upload/CategoryDropdown.svelte";
    import { UserRoles } from "$lib/types/UserRoles";
    import GamePicker from "../filtering/GamePicker.svelte";
    import axios from "axios";
    import { appendURL } from "$lib/utils/url";

    let userSearchQuery: string|undefined = $state("");
    let selectedUser: {id:number}|undefined = $state();
    let gameString: string|undefined = $state("");
    let roleString: string|undefined = $state("");
    let errorObj: any|undefined = $state();

    let isAdd = $state(false);
    let editRoleDialog = $state(false);
    let lastQueryTimeout: any = $state();

    let data = $state([]);

    function loadUsers() {
        axios.get(appendURL(`/api/users?username=${userSearchQuery}`), {
            withCredentials: true
        }).then((res) => {
            if (res.status === 200) {
                data = res.data.users;
            }
        }).catch((err) => {
            console.error(err);
        });
    }

    function handleRoleEdit() {
        let url = isAdd ? `/api/admin/users/addRole` : `/api/admin/users/removeRole`;
        axios.post(appendURL(url), {
            userId: selectedUser.id,
            gameName: gameString && gameString !== "" ? gameString : undefined,
            role: roleString
        }, {
            withCredentials: true
        }).then((res) => {
            if (res.status === 200) {
                editRoleDialog = false;
                errorObj = null;
                //fetchUsers();
            }
        }).catch((err) => {
            errorObj = err.response.data;
            console.error(err);
            console.log(err.response.data);
        });
    }
</script>


<div class="bg-neutral-background-2 p-4 rounded-lg max-w-sm min-w-[24rem]">
    <p class="text-xl">Lookup User</p>
    <Field label="Username" required>
        <Input bind:value={userSearchQuery} on:input={() => {
            if (!userSearchQuery || userSearchQuery.length < 3) {
                return;
            }
            if (lastQueryTimeout) {
                clearTimeout(lastQueryTimeout);
            }
            lastQueryTimeout = setTimeout(() => {
                loadUsers();
            }, 500);
        }}/>
    </Field>
</div>
<table>
    <thead>
        <tr>
            <td>ID</td>
            <td>PFP</td>
            <td>Display Name</td>
            <td>Username</td>
            <td>Github ID</td>
            <td>Sitewide Roles</td>
            <td>Per-Game Roles</td>
            <td>Actions</td>
        </tr>
    </thead>
    <tbody>
        {#each data as user}
            <tr>
                <td>{user.id}</td>
                <td><img
                    class="flex aspect-square h-8 rounded-circular"
                    alt="{user.username} PFP"
                    src="https://github.com/{user.username}.png"
                  /></td>
                <td>{user.displayName}</td>
                <td>{user.username}</td>
                <td>{user.githubId}</td>
                <td>{user.roles.sitewide.join(", ")}</td>
                <td>{JSON.stringify(user.roles.perGame)}</td>
                <td>
                    <Button on:click={() => {
                        editRoleDialog = true;
                        selectedUser = user;
                        isAdd = true;
                    }}>Add Role</Button>
                    <Button on:click={() => {
                        editRoleDialog = true;
                        selectedUser = user;
                        isAdd = false;
                    }}>Remove Role</Button>
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<Dialog.Root bind:open={editRoleDialog} type="modal">
    <Dialog.Header>{isAdd ? `Add` : `Remove`} Role</Dialog.Header>

    <Dialog.Body class="h-50">
        <p class="p-4">Editing roles for {selectedUser.username}. Do not specify a Game if you want to apply the role Sitewide.</p>
      <GamePicker class="p-4" bind:selectedGame={gameString} />
      <RadioGroup class="p-4" name="Role" bind:value={roleString}>
        {#each Object.keys(UserRoles) as roleKey}
          <Radio value={UserRoles[roleKey]}>{roleKey}</Radio>
        {/each}
      </RadioGroup>

      {#if errorObj}
        <p class="text-red-500">{errorObj.message ? errorObj.message : `Unknown error.`}<br>See browser console for more information.</p>
      {/if}
    </Dialog.Body>

    <Dialog.Actions class="justify-end">
      <Button
        onclick={() => {
          editRoleDialog = false;
        }}>Cancel</Button
      >
      <Button
        onclick={() => {
          handleRoleEdit();
        }}>Ok</Button
      >
    </Dialog.Actions>
  </Dialog.Root>

<style>
    table {
        width: 80%;
        border: #2c2c2c solid 1px;
    }

    tr, td {
        padding: 0.5rem;
    }

    thead {
        background-color: #505050;
        font-weight: bold;
    }

    td:nth-child(-n + 2) {
        width: 48px;
    }

    tr:nth-child(even) {
        background-color: #2c2c2c;
    }
</style>