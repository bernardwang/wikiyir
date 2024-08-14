<script setup>
import { ref } from 'vue'
import { CdxTextInput, CdxButton, CdxIcon, CdxSelect } from '@wikimedia/codex'
import { cdxIconArrowNext } from '@wikimedia/codex-icons'
import { getTopArticles, hydrateArticleList } from './topArticles.js'
import JigsawCard from './components/JigsawCard.vue'
import catFn from './categories.js'

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
  console.log(articleData.value)
}

const getCards = () => {
  const cards = []
  console.log(articleData.value.monthlyTopArticles)
  articleData.value.monthlyTopArticles.forEach((articles) => {
    if (category.value) {
      const catTitle = catFn(year.value)[category.value].title
      const filteredArticles = articles.filter(
        (a) => a.categories.includes(catTitle) || a.categories.includes(catTitle.replace(/_/g, ' '))
      )
      cards.push(filteredArticles[0])
    } else {
      cards.push(articles[0])
    }
  })
  console.log(cards)
  return cards
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
      <label>Your Wikipedia: </label>
      <cdx-text-input
        required
        pattern="[^\.]*\.(wikivoyage|wikinews|wikiversity|wikibooks|wikiquote|wiktionary|wikifunctions|wikisource|wikipedia|mediawiki|wikidata|wikimedia)"
        type="text"
        v-model="project"
      ></cdx-text-input>
      <cdx-select
        v-model:selected="year"
        :menu-items="yearItems"
        default-label="Choose an option"
      />
      <cdx-button @click="fetchArticles" action="progressive" weight="primary">
        <cdx-icon class="nextIcon" :icon="cdxIconArrowNext"></cdx-icon>
        <span>Get top articles</span>
      </cdx-button>
      <cdx-select
        v-if="articleData"
        v-model:selected="category"
        :menu-items="categoryItems"
        @change="updateCards"
        default-label="Filter"
      />
    </div>
    <div class="ribbon" v-if="articleData">
      <jigsaw-card
        v-for="(card, i) in getCards()"
        :image="card.image"
        :piece="i % 2"
        :link="card.url"
        :month="months[i]"
      ></jigsaw-card>
    </div>
  </main>
</template>

<style scoped>
header {
  width: 100%;
  background-color: #e679a6;
}

.logo {
}

.ribbon {
  display: flex;
  overflow-x: scroll;
  max-width: 100vw;
}
</style>
