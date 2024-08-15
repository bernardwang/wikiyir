<script setup>
import { ref, onMounted, onUpdated } from 'vue'
import Chart from 'chart.js/auto'
import { MONTHS, colorsList, transparentize } from '../chartUtils.js'

const myChart = ref(null)
const activeChart = ref(null);

const props = defineProps({
  numberMonths: {
    type: Number,
    required: true
  },
  dataset: {
    type: Object,
    required: true
  }
})

const makeChart = () => {
  const numMonths = props.numberMonths;
  const labels = MONTHS.slice(0, numMonths)
  const dataset = props.dataset.map((a, i) => {
    const color = colorsList[i % colorsList.length]
    return {
      label: a.article.replace(/_/g, ' '),
      borderColor: color,
      data: a.chart,
      backgroundColor: transparentize(color, 0.5)
    }
  })

  const data = {
    labels,
    datasets: dataset
  }

  return {
    type: 'line',
    data,
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
};

onUpdated(() => {
  if ( activeChart.value ) {
    activeChart.value.destroy();
    activeChart.value = new Chart(myChart.value, makeChart())
  }
})

onMounted(() => {
  activeChart.value = new Chart(myChart.value, makeChart())
})
</script>

<template>
  <canvas id="myChart" ref="myChart"></canvas>
</template>

<style scoped></style>
