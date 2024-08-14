<script setup>
defineProps({
  image: {
    type: String,
    required: true
  },
  piece: {
    type: Number,
    default: 0
  },
  link: {
    type: String,
    required: true
  }
})
</script>

<template>
    <div :class="'jigsaw-piece jigsaw-piece-' + piece">
        <a :href="link">
            <img :src="image">
         </a>
    </div>
</template>

<style scoped>
.jigsaw-piece {
    width: 320px;
    height: 320px;
    mask-image: url(./jigsaw.svg);
    mask-repeat: no-repeat;
    min-width: 320px;
}
.jigsaw-piece:hover {
    transform: rotate(10deg);
    transition: transform ease-in 100ms;
}
.jigsaw-piece img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    filter: grayscale(1);
}
.jigsaw-piece-1 {
    mask-image: url( jigsaw2.svg);
}
.jigsaw-piece-1:hover {
    transform: rotate(-10deg);
}
</style>
