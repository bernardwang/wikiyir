# wikiyir

Wiki Year in Review

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

# Takeaways from hack week

## All metrics APIs should support all-months

We had to aggregate results across 12 months.
We support all-days. It would be useful to also have all-months.
e.g.
https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/2024/all-months/all-days

## Most viewed per country should support all-days and all-months

Right now it is only possible to get the top article per country for a certain day
e.g.
https://wikimedia.org/api/rest_v1/metrics/pageviews/top-per-country/{country}/{access}/{year}/{month}/{day}

## Categories are annoying.

It would be great to be able to categorize "Movies", "Music", as well as deaths. Only deaths has an appropriate category.
We'd have to create a category tree. For example "2024 elections in Asia" rather than "2024 elections".

Could we make it possible to use API to get all parent categories as well as typical categories?

## Needs moderation / curation

Editors would need to be involved in the process of creating the year in review to help add notes to why things trended and to also filter out random stuff e.g. Cleopatra.

##  A production version of this page should be a static site

Generating the page involves heavy use of API but could easily be run once and built as a static site.

## When would we show this?

If the page is presented in January, then all data is available. If before January, we'd need to regularly rebuild the data sources on a daily basis.

# Support all-projects on editors apis

Not supported for "Get number of editors" (but supported for "number of new users").

