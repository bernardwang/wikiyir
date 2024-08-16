<template>
  <header class="header">
    <div class="wrapper">
      <img
        class="logo"
        src="https://upload.wikimedia.org/wikipedia/commons/e/ed/WP20Symbols_MediaWiki.svg"
        alt="Wikipedia logo"
      />
      <video class="generated-video" v-if="hasArticleData" width="320" height="240" controls>
        <source src="https://moonlit-cannoli-b892ff.netlify.app/final.mp4" type="video/mp4" />
      </video>
      <h1>Wikipedia Year in Review</h1>
    </div>
  </header>
</template>

<script setup>
defineProps({
  hasArticleData: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.header {
  width: 100%;
  background-color: #e679a6;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  position: relative;
}

.wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.logo {
  width: 300px;
}

.generated-video {
  position: absolute;
  left: calc(50% - 160px);
  top: 25px;
  bottom: 0;
}
</style>
