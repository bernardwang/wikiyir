<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  isCurrent: {
    type: Boolean,
    required: true
  }
})
</script>

<template>
  <div class="slide">
    <a :href="data.link">
      <img :src="data.image" />
    </a>
    <div class="text">
      <p class="title">{{ `#${index}` }}</p>
      <p class="title">{{ data.article }}</p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      {{ isCurrent }}
    </div>
  </div>
</template>

<style scoped>
.slide {
  display: flex;
  flex-direction: row;
  padding: 0 3rem;
}
.slide img {
  height: 100%;
  max-height: 250px;
  width: auto;
  object-fit: cover;
}
.title {
  font-size: 20px;
  font-weight: bold;
}
.text {
  text-align: left;
  padding: 0 1rem;
  max-width: 300px;
}
</style>
