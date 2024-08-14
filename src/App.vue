<script setup>
import { ref } from 'vue'
import { CdxLabel, CdxTextInput, CdxButton, CdxIcon, CdxSelect } from '@wikimedia/codex'
import { cdxIconArrowNext } from '@wikimedia/codex-icons'
import { getTopArticles } from './topArticles.js'
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

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

async function fetchArticles() {
  articleData.value = await getTopArticles({ project: project.value, limit: 10, year: year.value })
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
    <img
      class="logo"
      src="https://upload.wikimedia.org/wikipedia/commons/e/ed/WP20Symbols_MediaWiki.svg"
      width="512"
      height="401"
    />
    <h1>Wikipedia Year in Review</h1>
  </header>

  <main>
    <div class="wrapper">
      <div>
        <cdx-label input-id="wiki-input"> Your wiki: </cdx-label>
        <cdx-text-input
          required
          pattern="[^\.]*\.(wikivoyage|wikinews|wikiversity|wikibooks|wikiquote|wiktionary|wikifunctions|wikisource|wikipedia|mediawiki|wikidata|wikimedia)"
          type="text"
          v-model="project"
          id="wiki-input"
          class="wiki-input"
        ></cdx-text-input>
        <cdx-select
          v-model:selected="year"
          :menu-items="yearItems"
          default-label="Choose an option"
          class="year-select"
        />
      </div>
      <cdx-button class="submit-btn" @click="fetchArticles" action="progressive" weight="primary">
        <cdx-icon class="nextIcon" :icon="cdxIconArrowNext"></cdx-icon>
        <span>Get Year in Review</span>
      </cdx-button>
    </div>
    <section v-if="articleData">
      <h2>Top Articles in {{ year }}</h2>
      <div>
        <cdx-label input-id="filter-input"> Filter categories </cdx-label>
        <cdx-select
          v-model:selected="category"
          :menu-items="categoryItems"
          @change="updateCards"
          default-label="Filter"
          id="filter-select"
        />
      </div>
      <div class="ribbon">
        <jigsaw-card
          v-for="(card, i) in getCards()"
          :image="card.image"
          :piece="i % 2"
          :link="card.url"
        ></jigsaw-card>
      </div>
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
}

.logo {
}

.ribbon {
  display: flex;
  overflow-x: scroll;
  max-width: 100vw;
}

.wiki-input {
  max-width: 256px;
}
</style>
