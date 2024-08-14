<script setup>

import { ref } from 'vue'
import { CdxTextInput, CdxButton, CdxIcon, CdxSelect } from '@wikimedia/codex';
import { cdxIconArrowNext } from '@wikimedia/codex-icons';
import queryTopArticles from './topArticles.js';
import JigsawCard from './components/JigsawCard.vue';

const project = ref('en.wikipedia');
const year = ref('2024');
const cards = ref({});
const category = ref('');

const yearItems = [
	{ label: '2024', value: '2024' },
	{ label: '2023', value: '2023' },
	{ label: '2022', value: '2022' },
	{ label: '2021', value: '2021' },
	{ label: '2020', value: '2020' },
];

const categoryItems = [
	{ label: 'All', value: '' },
	{ label: 'Passings', value: 'Category:2024_deaths' }
];

async function fetchArticles() {
  cards.value = await queryTopArticles({ project: project.value, limit: 10, year: year.value });
}

const getCards = () => {
  if ( category.value && cards.value.byCategory ) {
    return cards.value.byCategory[category.value];
  } else {
    return cards.value.yearlyTopArticles;
  }
}
</script>

<template>
  <header>
    <div class="wrapper">
      <label>Your Wikipedia: </label>
		  <cdx-text-input required
			  pattern="[^\.]*\.(wikivoyage|wikinews|wikiversity|wikibooks|wikiquote|wiktionary|wikifunctions|wikisource|wikipedia|mediawiki|wikidata|wikimedia)" type="text" v-model="project"></cdx-text-input>
        <cdx-select
	    	v-model:selected="year"
	    	:menu-items="yearItems"
	    	default-label="Choose an option"
	    />
      <cdx-button v-if="!cards.byCategory" @click="fetchArticles" action="progressive" weight="primary">
			  <cdx-icon class="nextIcon" :icon="cdxIconArrowNext"></cdx-icon>
			  <span>Get top articles</span>
		  </cdx-button>
      <cdx-select
        v-if="cards && cards.byCategory"
        v-model:selected="category"
        :menu-items="categoryItems"
        @change="updateCards"
        default-label="Filter" />
    </div>
  </header>

  <main>
    <div class="ribbon">
      <jigsaw-card v-for="(card, i) in getCards()"
        :image="card.image"
        :piece="i % 2"
        :link="card.url"></jigsaw-card>
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}
.ribbon {
  display: flex;
  flex-flow: wrap;
  justify-content: center;
}
main {
  grid-area: 1 / 3;
}
@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: start;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
