<script setup>
import { ref } from 'vue'
import { CdxLabel, CdxTextInput, CdxButton, CdxIcon, CdxSelect } from '@wikimedia/codex'
import { cdxIconArrowNext } from '@wikimedia/codex-icons'
import fetchData from './fetchData.js'
import Chart from './components/Chart.vue'
import JigsawCard from './components/JigsawCard.vue'

const project = ref('en.wikipedia')
const year = ref('2024')
const articleData = ref(null)
const category = ref('')

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

async function fetchArticles() {
  articleData.value = await fetchData({ project: project.value, limit: 10, year: year.value })
  window.articleData = articleData.value
}

const getCards = () => {
  if (category.value) {
    return articleData.value.categorizedYearlyTopArticles[category.value]
  } else {
    return articleData.value.yearlyTopArticles
  }
}
</script>

<template>
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
          pattern="[^\.]*\.(wikivoyage|wikinews|wikiversity|wikibooks|wikiquote|wiktionary|wikifunctions|wikisource|wikipedia|mediawiki|wikidata|wikimedia)"
          type="text"
          v-model="project"
          id="wiki-input"
          class="wiki-input"
        ></cdx-text-input>
      </div>
      <div v-if="articleData">
        <cdx-label input-id="filter-input"> Categories </cdx-label>
        <cdx-select
          v-model:selected="category"
          :menu-items="categoryItems"
          @change="updateCards"
          default-label="Filter"
          id="filter-select"
        />
      </div>
      <div v-if="!articleData">
        <cdx-button class="submit-btn" @click="fetchArticles" action="progressive" weight="primary">
          <cdx-icon class="nextIcon" :icon="cdxIconArrowNext"></cdx-icon>
          <span>Get Year in Review</span>
        </cdx-button>
      </div>
    </section>
    <section class="top-articles" v-if="articleData">
      <div class="wrapper">
        <h2 class="top-article-heading">Top Articles in {{ year }}</h2>
        <div class="ribbon">
          <jigsaw-card
            v-for="(card, i) in getCards()"
            :image="card.image"
            :piece="i % 2"
            :link="card.url"
          ></jigsaw-card>
        </div>
      </div>
    </section>
    <section class="timeline-chart wrapper" v-if="articleData">
      <chart :articleData="articleData"></chart>
    </section>
    <section :class="{ wrapper: true, 'map-hidden': !articleData }">
      <div id="map" class="map" ref="map"></div>
    </section>
  </main>
</template>

<style scoped>
header {
  width: 100%;
  background-color: #e679a6;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  position: relative;
}

.wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.logo {
  width: 300px;
}

.generated-video {
  position: absolute;
  left: calc(50% - 160px);
  top: 25px;
  bottom: 0;
}

.input-wrapper {
  padding: 1rem 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
}

.top-articles {
  background-color: #e9e7c3;
  padding: 3rem 0;
}
.top-article-heading {
  text-align: center;
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
  max-width: 256px;
}

.map {
  position: relative;
  width: 100%;
  height: 500px;
}

.map-hidden {
  visibility: hidden;
}
</style>
