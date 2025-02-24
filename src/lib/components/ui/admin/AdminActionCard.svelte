<script lang="ts">
    import { Button } from "@svelte-fui/core";
    import axios from "axios";
    import type { Snippet } from "svelte";

    let { 
        title, 
        description, 
        buttonText, 
        buttonUrl,
        slot,
        reqBody
    }: {
        title: string;
        description: string;
        buttonText: string;
        buttonUrl: string;
        slot?: Snippet;
        reqBody?: any;
    } = $props();

    let responseMessage = $state("");
    let wasResponseGood = $state(false);
    let isButtonAwaitingResponse = $state(false);

    async function buttonAction() {
        isButtonAwaitingResponse = true;
        await axios.post(buttonUrl, reqBody, {
            withCredentials: true
        }).then((res) => {
            console.log("Action executed successfully");
            if (res.data && `message` in res.data) {
                console.log(res.data.message);
                responseMessage = res.data.message;
            } else {
                responseMessage = "Action executed successfully. Check logs for more information.";
            }
            wasResponseGood = true;
        }).catch((error) => {
            console.error("Failed to execute action");
            console.error(error);
            console.log(error.response.data);
            if (error.response?.data && `message` in error.response.data) {
                responseMessage = error.response.data.message;
            } else {
                responseMessage = "Failed to execute action. Check logs for more information.";
            }
            wasResponseGood = false;
        });
        isButtonAwaitingResponse = false;
    }
</script>

<div class="bg-neutral-background-2 p-4 rounded-lg max-w-sm min-w-[24rem]">
    <p class="text-xl">{title}</p>
    <p class="text-l p-2 text-neutral-foreground-3">{description}</p>
    {#if slot}
        {@render slot()}
    {/if}
    <Button on:click={buttonAction} disabled={isButtonAwaitingResponse}>{buttonText}</Button>
    {#if isButtonAwaitingResponse}
        <p class="text-l pt-2 text-neutral-foreground-3">Executing...</p>
    {/if}
    {#if responseMessage !== ""}
        {#if wasResponseGood}
            <p class="text-l pt-2 text-green-600">{responseMessage}</p>
        {:else}
            <p class="text-l pt-2 text-red-600">{responseMessage}</p>
        {/if}
    {/if}
</div>