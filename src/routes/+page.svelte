<script lang="ts">
</script>

<section>
  <div class="welcomer">
    <div class="logo">
      <span class="beatmods-txt welcome">Welcome to</span>
      <span class="beatmods-txt primary">Beat</span>
      <span class="beatmods-txt secondary">Mods</span>
      <span class="beatmods-txt exclamation">!</span>
    </div>
    <p class="headliner">Make BeatSaber <i>Your Own</i></p>
  </div>
</section>

<style>
  .headliner {
    font-size: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .welcome {
    margin-right: 10px !important;
  }

  .exclamation {
    margin-left: 10px !important;
  }

  .logo {
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .primary {
    color: #662d91;
  }

  .secondary {
    color: #92278f;
  }

  .beatmods-txt {
    margin: 0px;
    font-size: 40px;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    display: inline;
    line-height: 100px;
    font-size-adjust: cap-height 0.73;
    pointer-events: none;
    transition-property: text-shadow;
    transition-duration: 0.2s;
  }

  section {
    display: flex;
    justify-content: center;
  }

  .welcomer {
    width: 800px;
    height: 350px;
    backdrop-filter: blur(100px);
    background-image: linear-gradient(135deg, #bbb3, #ffffff05);
    border-radius: 40px;
    border: #aaa 1px solid;
    display: flex;
    justify-content: top;
    flex-direction: column;
  }
</style>
