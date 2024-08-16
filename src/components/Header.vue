<template>
  <section class="splash-container">
    <div class="splash wrapper">
      <div class="splash-text">
        <h1>Wikipedia Year in Review</h1>
        <p>
          Wikipedia is the world’s essential and reliable resource dedicated to recording and
          preserving the world’s knowledge, ensuring that everyone has access to our shared history.
          Without this collective effort, much of what shapes our world today would be lost, and
          future generations would miss out on understanding our collective journey.
        </p>
      </div>
      <img class="svg invert" src="../assets/brain.svg" />
      <video class="generated-video" v-if="hasArticleData" width="420" height="340" controls="">
        <source src="https://moonlit-cannoli-b892ff.netlify.app/final.mp4" type="video/mp4" />
      </video>
    </div>
  </section>
</template>

<script setup>
defineProps({
  hasArticleData: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.splash-container {
  width: 100%;
  height: 400px;
  background: #0d65c0;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  position: relative;
}

.splash {
  display: flex;
  flex-direction: row;
  gap: 20px;
}
.splash-text {
  max-width: 300px;
}

.svg {
  width: 400px;
}
.invert {
  filter: invert(1);
}

.wrapper {
  margin: 0 auto;
}

.generated-video {
  position: absolute;
  right: 10%;
  top: 30px;
}
</style>
