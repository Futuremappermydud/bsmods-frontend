<script lang="ts">
  import TimeAgo from "javascript-time-ago";
  import type { ModData } from "../types/Mods";

  const timeAgo = new TimeAgo("en-US");

  let { mod }: { mod: ModData } = $props();

  let dependencies = $derived(mod.mod.dependencies.map((dep) => `${dep.name}`));

  let date = new Date(props.mod.updatedDate);

  let formattedDate = $derived(timeAgo.format(date));

  let status = props.mod.status;

  let pending = status === "pending";
  let approved = status === "approved";
  let declined = status === "declined";

  function download() {
    console.log("Download button clicked");
  }

  function moreInfo() {
    console.log("More Info button clicked");
  }

  function edit() {
    console.log("Edit button clicked");
  }
</script>

<div class="modal">
  <div class="mod-header">
    <span class="mod-title">{props.mod.name}</span>
    <span class="mod-version">v{props.mod.version}</span>
  </div>
  <div class="mod-sub-header">
    <p class="mod-author">By {props.mod.author.username}</p>
  </div>
  <div class="tags">
    <span class="category tag">{props.mod.category}</span>
    <span class="status tag" class:approved class:declined class:pending
      >{status}</span
    >
  </div>
  {#if props.mod.description.length > 0}
    <div class="mod-description">
      <span class="description-label">Description: </span>
      <span class="description">{props.mod.description}</span>
    </div>
  {/if}
  {#if dependencies.length > 0}
    <div class="mod-dependencies">
      <span class="dependency-label">Dependencies: </span>
      <span class="dependency-list">{dependencies.join(", ")}</span>
    </div>
  {/if}
  <div class="corner-tags">
    <p class="single-corner-tag">{formattedDate}</p>
    <p class="single-corner-tag">{props.mod.gameVersion}</p>
  </div>
  <div class="button-container">
    <button class="mod-button" onclick={download}>Download</button>
    <button class="mod-button" onclick={moreInfo}>More Info</button>
    <button class="mod-button small" onclick={edit}>Edit</button>
  </div>
</div>

<style>
  .mod-header,
  .mod-sub-header,
  .mod-dependencies,
  .mod-description {
    margin: 15px;
    right: 50px;
    margin-top: 5px !important;
    position: relative;
    left: 0px;
    text-overflow: ellipsis;
    overflow: hidden;
    color: white;
    display: inline-flex !important;
    gap: 5px;
    align-items: baseline;
    margin-bottom: 0px;
    max-width: 325px;
    margin-right: 0px;
  }

  .mod-title {
    font-size: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mod-version {
    font-size: 10px;
    color: #aaa;
  }

  .mod-sub-header {
    margin-top: 0px !important;
  }

  .mod-author {
    font-size: 12px;
    color: #aaa;
    margin: 0;
    font-style: italic;
  }

  .tags {
    margin-top: 8px;
    margin-left: 10px;
    display: flex;
    flex-direction: row;
    gap: 5px;
  }

  .tag {
    width: fit-content;
    height: fit-content;
    border-radius: 5px;
    padding: 2px 5px 2px 5px;
  }

  .category {
    background-color: #777;
  }

  .status {
    display: inline-block !important;
  }

  .status::first-letter {
    text-transform: uppercase;
  }

  .pending {
    background-color: #f0ad4e;
  }

  .approved {
    background-color: #5cb85c;
  }

  .declined {
    background-color: #d9534f;
  }

  .mod-dependencies,
  .mod-description {
    flex-direction: column !important;
    gap: 1px !important;
    margin-right: 10px !important;
    max-width: none !important;
    overflow: visible;
    margin-top: 7.5px !important;
  }

  .description {
    font-size: 12px;
  }

  .dependency-label,
  .description-label {
    font-size: 14px;
    position: relative;
    left: -5px;
    color: #ddd;
  }

  .dependency-list {
    font-size: 11px;
    color: #e83e8c;
    word-break: break-word;
  }

  .corner-tags {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 100px;
    height: 80px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .single-corner-tag {
    background-color: rgba(217, 217, 217, 0.1);
    width: fit-content;
    padding: 5px;
    border-radius: 5px;
    flex: 1;
    margin: 0;
    text-align: center;
    align-content: center;
    font-size: 14px;
    margin-left: auto;
  }

  .button-container {
    position: absolute;
    bottom: 0;
    width: calc(100% - 10px);
    height: 55px;
    display: flex;
    flex-direction: row;
    margin: 5px;
    gap: 5px;
  }

  .mod-button {
    display: inline-flex;
    flex-grow: 1;
    flex: 1;
    border: none;
    border-radius: 5px;
    text-align: center;
    font-size: 18px;
    font-style: italic;
    font-family: "Poppins", serif;
    align-content: center;
    justify-content: center;
    align-items: center;
    color: white;
    background-color: rgba(217, 217, 217, 0.2);
    transition-property: background-color;
    transition-duration: 0.1s;
  }

  .mod-button:hover {
    background-color: rgba(217, 217, 217, 0.4);
    cursor: pointer;
  }

  .small {
    flex: 0.5 !important;
  }
</style>
