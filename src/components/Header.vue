<template>
  <header class="header">
    <div class="wrapper welcome">
      <div>
        <h1>Wikipedia Year in Review</h1>
        <p v-if="!hasArticleData">
          Wikipedia is the world’s essential and reliable resource dedicated to recording and preserving the world’s knowledge, ensuring that everyone has access to our shared history. Without this collective effort, much of what shapes our world today would be lost, and future generations would miss out on understanding our collective journey.
        </p>
      </div>
      <img v-if="!hasArticleData"
        class="logo"
        src="../assets/brain.svg"
      />
      <video class="generated-video" v-if="hasArticleData" width="320" height="240" controls="">
        <source src="https://moonlit-cannoli-b892ff.netlify.app/final.mp4" type="video/mp4" />
      </video>
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
.welcome {
  color: white;
  display: flex;
  font-size: 24px;
}
.welcome h1 {
  font-size: 56px;
}
</style>
