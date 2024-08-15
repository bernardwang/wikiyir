<script setup>
import initMap from './map';
import { ref, onUpdated } from 'vue'
import { CdxLabel, CdxTextInput, CdxButton, CdxIcon, CdxSelect } from '@wikimedia/codex'
import { cdxIconArrowNext } from '@wikimedia/codex-icons'
import fetchData from './fetchData.js'
import Chart from './components/Chart.vue'
import JigsawCard from './components/JigsawCard.vue'

const project = ref('en.wikipedia')
const year = ref('2024')
const articleData = ref(null)
const category = ref('')

const bytesAdded = ref( 0 );
const numNewEditors = ref( 0 );
const numEditors = ref( 0 );
const numEdits = ref( 0 );

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

const toReadable = ( num ) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const updateFromData = ( data ) => {
  bytesAdded.value = toReadable( data.bytes );
  numEdits.value = toReadable( data.numEdits );
  numEditors.value = toReadable( data.numEditors );
  numNewEditors.value = toReadable( data.numNewEditors );
}

async function fetchArticles() {
  const data = await fetchData({ project: project.value, limit: 10, year: year.value });
  updateFromData( data );
  articleData.value = data;
  window.articleData = articleData.value
}

/**
 * If a search already got carried out, changing dropdown will update the query.
 */
async function updateIfNewYearSelected( newYear ) {
  if ( articleData.value ) {
    const data = await fetchData({ project: project.value, limit: 10, year: newYear });
    updateFromData( data );
    articleData.value = data;
  }
}

const getCards = ref( () => {
  if (category.value) {
    return articleData.value.categorizedYearlyTopArticles[category.value]
  } else {
    return articleData.value.yearlyTopArticles
  }
} );

onUpdated( () => {
  initMap( project.value, year.value );
} );
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
      <div v-if="articleData">
        <cdx-label input-id="filter-input"> Categories </cdx-label>
        <cdx-select
          v-model:selected="category"
          :menu-items="categoryItems"
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
      <chart :numberMonths="articleData.monthlyTopArticles.length"
        :dataset="articleData.yearlyTopArticles"></chart>
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
      <img src="./assets/community.svg" width="300"/>
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

.editor-stats {
  display: flex;
  gap: 50px;
  justify-content: center;
  background: #F0BC00;
  padding: 40px 16px;
}
.editor-stats > div {
  display: flex;
  flex-flow: wrap;
  justify-content: center;
  width: 400px;
}
.editor-stats dl {
  width: 150px;
}
</style>
