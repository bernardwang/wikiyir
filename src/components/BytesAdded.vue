<template>
  <div class="container">
    <div class="grid-area">
      <div v-for="n in 132" :key="n" class="grid-item"></div>
    </div>
    <div class="text-area">
      <h1>{{ formatNumber(data) }} bytes added</h1>
      <p>This vast repository of knowledge is only made possible through the work of volunteer editors, who
        dedicate untold numbers of hours to writing articles, fixing mistakes, uploading images, and
        making the wikis better for everyone on the planet. These Wikipedians are the beating heart
        of the project, deeply committed to the accuracy and accessibility of information.</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  data: {
    type: [Number, String],
    required: true
  }
});

function formatNumber(num) {
  return typeof num === 'number' ? num.toLocaleString() : num;
}
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  align-items: start;
  height: 100%;
  padding: 20px;
  background-color: #E0F7E5;
}

.grid-area {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(11, 1fr);
  gap: 4px;
  aspect-ratio: 12 / 11;
}

.grid-item {
  background-color: #7FCBA0;
  border-radius: 4px;
}

.text-area {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: serif;
  color: #333;
}

.text-area h1 {
  font-size: 2.25rem;
  margin-bottom: 1rem;
}

.text-area p {
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>