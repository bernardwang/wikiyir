<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import { MONTHS, colorsList, transparentize } from '../chartUtils.js'

const myChart = ref(null)

const props = defineProps({
  articleData: {
    type: Object,
    required: true
  }
})

const numMonths = props.articleData.monthlyTopArticles.length
const labels = MONTHS.slice(0, numMonths)

const dataset = props.articleData.yearlyTopArticles.map((a, i) => {
  const color = colorsList[i % colorsList.length]
  return {
    label: a.article,
    borderColor: color,
    data: a.chart,
    backgroundColor: transparentize(color, 0.5)
  }
})

const data = {
  labels,
  datasets: dataset
}

const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Top Articles Throughout the Year'
      }
    }
  }
}

onMounted(() => {
  new Chart(myChart.value, config)
})
</script>

<template>
  <canvas id="myChart" ref="myChart"></canvas>
</template>

<style scoped></style>
