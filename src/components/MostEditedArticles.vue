<template>
  <div class="most-edited-articles">
    <canvas ref="chart"></canvas>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, watch, computed } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const chart = ref(null)
let chartInstance = null

const processedData = computed(() => {
  return props.data.map(item => {
    const parsedItem = typeof item === 'string' ? JSON.parse(item) : item
    return {
      title: parsedItem.title,
      edits: parsedItem.edits
    }
  })
})

const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chart.value.getContext('2d')
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: processedData.value.map(item => item.title),
      datasets: [{
        label: 'Number of Edits',
        data: processedData.value.map(item => item.edits),
        backgroundColor: '#FBEEBF',
        borderColor: '#E0C675',
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Most Edited Articles'
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Edits'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Article Title'
          }
        }
      }
    }
  })
}

onMounted(() => {
  if (props.data && props.data.length > 0) {
    createChart()
  }
})

watch(() => props.data, (newData) => {
  if (newData && newData.length > 0) {
    createChart()
  }
}, { deep: true })
</script>

<style scoped>
.most-edited-articles {
  width: 100%;
}
</style>