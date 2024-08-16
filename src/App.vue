<script setup>
import initMap from './map'
import { ref, watch, computed } from 'vue'
import { CdxLabel, CdxTextInput, CdxButton, CdxIcon, CdxSelect } from '@wikimedia/codex'
import { cdxIconArrowNext, cdxIconHeart } from '@wikimedia/codex-icons'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import fetchData from './services/api/fetchData.js'
import { TopArticlesAPI } from './services/api'
import TopArticlesChart from './components/TopArticlesChart.vue'
import ArticleHistoryChart from './components/ArticleHistoryChart.vue'
import ArticleSlide from './components/ArticleSlide.vue'
import 'vue3-carousel/dist/carousel.css'
import MostEditedArticles from './components/MostEditedArticles.vue'
import BytesAdded from './components/BytesAdded.vue'
import StickyFooter from './components/StickyFooter.vue'
import DonateToday from './components/DonateToday.vue'

const project = ref('en.wikipedia')
const year = ref('2024')
const articleData = ref(null)
const category = ref('')
const currentArticleIndex = ref(0)
const currentArticleHistoryData = ref(null)
const currentArticleTitle = ref('')

const bytesAdded = ref(0)
const numNewEditors = ref(0)
const numEditors = ref(0)
const numEdits = ref(0)

const mostEditedArticles = ref([])

const yearItems = [
  { label: '2024', value: '2024' },
  { label: '2023', value: '2023' },
  { label: '2022', value: '2022' },
  { label: '2021', value: '2021' },
  { label: '2020', value: '2020' }
]

const categoryItems = [
  { label: 'All', value: '' },
  { label: 'Passings', value: '0' },
  { label: 'Movies', value: '1' },
  { label: 'Science', value: '2' }
]

const toReadable = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const updateFromData = (data) => {
  bytesAdded.value = toReadable(data.bytes)
  numEdits.value = toReadable(data.numEdits)
  numEditors.value = toReadable(data.numEditors)
  numNewEditors.value = toReadable(data.numNewEditors)
  mostEditedArticles.value = data.mostEditedArticles || []
  console.log('Updated mostEditedArticles:', mostEditedArticles.value)
}

async function fetchArticles() {
  const data = await fetchData({ project: project.value, limit: 10, year: year.value })
  updateFromData(data)
  articleData.value = data
  window.articleData = articleData.value
}

/**
 * If a search already got carried out, changing dropdown will update the query.
 */
async function updateIfNewYearSelected(newYear) {
  if (articleData.value) {
    const data = await fetchData({ project: project.value, limit: 10, year: newYear })
    updateFromData(data)
    articleData.value = data
  }
}

const getSlideData = ref(() => {
  if (category.value) {
    return articleData.value.categorizedYearlyTopArticles[category.value]
  } else {
    return articleData.value.yearlyTopArticles
  }
})

async function getArticleHistoryData(currentArticleIndex) {
  try {
    const currentArticle = articleData.value.yearlyTopArticles[currentArticleIndex]
    currentArticleHistoryData.value = await TopArticlesAPI.getArticleHistory(
      currentArticle,
      project.value,
      year.value
    )
    currentArticleTitle.value = currentArticle.article.replace(/_/g, ' ')
    console.log('Article history data:', currentArticleHistoryData.value)
  } catch (error) {
    console.error('Error fetching article history data:', error)
    currentArticleHistoryData.value = null
    currentArticleTitle.value = ''
  }
}

watch(project, (newProject) => {
  initMap(newProject, year.value)
})

watch(year, (newYear) => {
  initMap(project.value, newYear)
})

watch(currentArticleIndex, async (newIndex) => {
  getArticleHistoryData(newIndex)
})

watch(articleData, async () => {
  getArticleHistoryData(currentArticleIndex.value)
  initMap(project.value, year.value)
})

watch(currentArticleHistoryData, (newData) => {
  console.log('Current article history data updated:', newData)
})
</script>

<template>
  <div id="app">
    <header class="header">
      <div class="wrapper">
        <img
          class="logo"
          src="https://upload.wikimedia.org/wikipedia/commons/e/ed/WP20Symbols_MediaWiki.svg"
        />
        <video class="generated-video" v-if="articleData" width="320" height="240" controls="">
          <source src="https://moonlit-cannoli-b892ff.netlify.app/final.mp4" type="video/mp4" />
        </video>
        <h1>Wikipedia Year in Review</h1>
      </div>
    </header>

    <main>
      <section class="input-wrapper wrapper">
        <div>
          <cdx-label input-id="wiki-input"> Year</cdx-label>
          <cdx-select
            @update:selected="updateIfNewYearSelected"
            v-model:selected="year"
            :menu-items="yearItems"
            default-label="Choose an option"
            class="year-select"
          />
        </div>
        <div>
          <cdx-label input-id="wiki-input"> Wiki:</cdx-label>
          <cdx-text-input
            required
            :disabled="articleData !== null"
            pattern="[^\.]*\.(wikivoyage|wikinews|wikiversity|wikibooks|wikiquote|wiktionary|wikifunctions|wikisource|wikipedia|mediawiki|wikidata|wikimedia)"
            type="text"
            v-model="project"
            id="wiki-input"
            class="wiki-input"
          ></cdx-text-input>
        </div>
        <div v-if="false">
          <cdx-label input-id="filter-input"> Categories </cdx-label>
          <cdx-select
            v-model:selected="category"
            :menu-items="categoryItems"
            default-label="Filter"
            id="filter-select"
          />
        </div>
        <div>
          <cdx-button class="submit-btn" @click="fetchArticles" action="progressive" weight="primary">
            <cdx-icon class="nextIcon" :icon="cdxIconArrowNext"></cdx-icon>
            <span>Get Year in Review</span>
          </cdx-button>
        </div>
      </section>
      <section class="top-articles" v-if="articleData">
        <div class="wrapper">
          <h2 class="top-article-heading">Most visited articles in {{ year }}</h2>
          <carousel :items-to-show="1" v-model="currentArticleIndex">
            <slide v-for="(slide, i) in getSlideData()" :key="i">
              <article-slide
                :data="slide"
                :index="i + 1"
                :isCurrent="i === currentArticleIndex"
              ></article-slide>
            </slide>
            <template #addons>
              <navigation />
              <pagination />
            </template>
          </carousel>
        </div>
      </section>
      <section class="timeline-chart wrapper" v-if="currentArticleHistoryData">
        <div v-if="currentArticleHistoryData === null">Loading chart data...</div>
        <article-history-chart
          v-else
          :dataset="currentArticleHistoryData"
          :title="currentArticleTitle"
        ></article-history-chart>
      </section>
      <section :class="{ wrapper: true, 'map-hidden': !articleData }">
        <div id="map" class="map" ref="map"></div>
      </section>
      <section v-if="articleData" class="editor-stats wrapper">
        <div>
          <dl>
            <dt>{{ numEditors }}</dt>
            <dd>editors this year</dd>
          </dl>
          <dl>
            <dt>{{ numNewEditors }}</dt>
            <dd>new editors</dd>
          </dl>
          <dl>
            <dt>{{ numEdits }}</dt>
            <dd>edits</dd>
          </dl>
          <dl>
            <dt>{{ bytesAdded }}</dt>
            <dd>bytes added</dd>
          </dl>
        </div>
        <img src="./assets/community.svg" width="300" />
      </section>
      <section v-if="articleData" class="edit-stats wrapper">
        <div>
          <MostEditedArticles :data="mostEditedArticles" />
        </div>
      </section>
      <section v-if="articleData" class="bytes-stats wrapper">
        <BytesAdded :data="bytesAdded" />
      </section>
      <section v-if="articleData" class="donate-today wrapper">
        <DonateToday />
      </section>
    </main>

    <StickyFooter />
  </div>
</template>

<style scoped>
.splash-container {
  width: 100%;
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

.knowledge {
  background: #c0e6ff;
  color: black;
}

.bytes {
  background: #dcf3ec;
  color: black;
}

.heart {
  background: #e5c0c0;
  color: black;
}

.wrapper {
  max-width: 650px;
  margin: 0 auto;
  width: 100%;
}

.svg {
  width: 300px;
}

.invert {
  filter: invert(1);
}

.carousel {
  margin-top: 1rem;
}
.generated-video {
  position: absolute;
  left: calc(50% - 160px);
  top: 25px;
  bottom: 0;
}

.input-container {
  background-color: #e9e7c3;
  padding: 1rem 0;
}

.input {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
}

.top-articles {
  padding: 1rem 0;
}

.timeline-chart {
  padding: 1rem 0;
}

.ribbon {
  display: flex;
  overflow-x: scroll;
  max-width: 100vw;
  height: 100%;
  overflow-y: hidden;
  padding: 2rem 0;
}

.wiki-input {
  max-width: 200px;
}

.year-input {
  max-width: 200px;
}

.map {
  position: relative;
  width: 100%;
}

.map-hidden {
  visibility: hidden;
}

.editors {
  background: #f9f9f0;
}

.editor-stats-container {
  display: flex;
  gap: 50px;
  justify-content: center;
  background: #fbeebf;
  padding: 20px 16px;
}

.editor-stats-container > div {
  justify-content: center;
  width: 400px;
}

.editor-stats dl {
  width: 150px;
}

.edit-stats {
  background: #F9F9F0;
}

.bytes-stats {
  display: flex;
  gap: 50px;
  justify-content: center;
  background: #DCF3EC;
  padding: 40px 16px;
}

</style>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Ensure main content takes up available space */
.main-content {
  flex: 1 0 auto;
}

/* You may need to adjust other global styles */
body {
  margin: 0;
  padding: 0;
}
</style>