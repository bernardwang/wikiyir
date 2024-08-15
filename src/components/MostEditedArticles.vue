<template>
  <Bar
    v-if="chartData"
    :data="chartData"
    :options="chartOptions"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  }
})

const chartData = computed(() => ({
  labels: props.data.map(item => item.title || ''),
  datasets: [
    {
      label: 'Number of Edits',
      data: props.data.map(item => item.edits || 0),
      backgroundColor: '#FBEEBF',
      borderColor: '#E6D296',
      borderWidth: 1
    }
  ]
}))

const chartOptions = {
  responsive: true,
  indexAxis: 'y',
  scales: {
    x: {
      beginAtZero: true
    }
  }
}
</script>

<style scoped>
canvas {
  max-width: 100%;
}
</style>