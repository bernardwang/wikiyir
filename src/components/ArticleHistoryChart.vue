<script setup>
import { ref, onMounted, onUpdated } from 'vue'
import Chart from 'chart.js/auto'
import { colorsList, transparentize } from '../services/api/chartUtils.js'

const myChart = ref(null)
const activeChart = ref(null)

const props = defineProps({
  dataset: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

const makeChart = () => {
  if (!props.dataset) {
    return
  }

  const color = colorsList[Math.floor(Math.random() * colorsList.length)]
  const chartData = props.dataset.map((a) => ({ x: a.timestamp, y: a.views }))
  const datasets = [
    {
      label: props.title,
      borderColor: color,
      data: chartData,
      backgroundColor: transparentize(color, 0.5)
    }
  ]

  if (activeChart.value) {
    activeChart.value.destroy()
  }

  const data = {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true,
      aspectRatio: 4,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: `${props.title} throughout the year`
        }
      },
      animations: {
        tension: {
          duration: 1000,
          easing: 'linear',
          from: 1,
          to: 0
        }
      }
    }
  }

  console.log(data)

  activeChart.value = new Chart(myChart.value, data)
}

onUpdated(() => {
  makeChart()
})

onMounted(() => {
  makeChart()
})
</script>

<template>
  <canvas id="myChart" ref="myChart"></canvas>
</template>

<style scoped></style>
