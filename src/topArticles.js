import catFn from './categories.js'

const filterOut = (item) =>
  ![
    'Special:Search',
    'Taylor_Swift',
    'Indian_Premier_League',
    'Porno_y_helado',
    'WrestleMania_XL',
    'Facebook',
    'Jeffrey_Epstein',
    'Saltburn_(film)',
    'Griselda_Blanco',
    '2024_Indian_Premier_League',
    'Deaths_in_2024',
    'YouTube',
    'Main_Page',
    'Cleopatra',
    'Pornhub',
    'XXXTentacion',
    '.xxx',
    'Juneteenth',
    'Indian_Premier_League'
  ].includes(item.article.replace(/ /g, '_')) && !item.article.includes('List_of')

// Retrieve the top Wikipedia articles using the Wikimedia API.
async function getMonthlyTopArticles(
  project,
  limit = 1,
  year = '2023',
  month = '01',
  mainNSOnly = true,
  excludeMainPage = true
) {
  const endpoint = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/${project}/all-access/${year}/${month}/all-days`

  try {
    const response = await fetch(endpoint)

    if (response.ok) {
      const data = await response.json()
      const articles = data.items[0].articles
        .filter((a) => (mainNSOnly ? a.article.indexOf(':') === -1 : true))
        .filter((a) => (excludeMainPage ? a.article != 'Main_Page' : true))
        .filter(filterOut)
        .slice(0, limit)
        .map((a) => ({
          ...a,
          ...{
            project,
            year,
            month
          }
        }))
        .map((a) => {
          const host = `https://${project}.org`.replace(
            /https:\/\/([^\.]*)\.wiki/,
            'https://$1.wiki'
          )
          const encodedTitle = encodeURIComponent(a.article)
          a.url = `${host}/wiki/${encodedTitle}`
          return a
        })
      return articles
    } else {
      // eslint-disable-next-line no-console
      console.error(`Error: ${response.status}`)
      return null
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error)
    return null
  }
}

async function hydrateArticleList(articles, year) {
  const categories = catFn(year)
    .map((a) => encodeURIComponent(a.title))
    .join('|')
  const titles = articles.map((article) => encodeURIComponent(article.article)).join('|')
  const json = await fetch(
    `https://en.wikipedia.org/w/api.php?pithumbsize=400&pilimit=max&origin=*&action=query&format=json&prop=pageimages%7Ccategories&titles=${titles}&formatversion=2&clprop=&clshow=!hidden&clcategories=${categories}`
  ).then((r) => r.json())
  const lookup = {}
  json.query.pages.forEach((page) => {
    const dbkey = page.title.replace(/ /g, '_')
    lookup[dbkey] = {
      image: page.thumbnail ? page.thumbnail.source : null,
      categories: (page.categories || []).map((c) => c.title)
    }
  })
  return articles
    .map((article) => Object.assign({}, article, lookup[article.article.replace(/ /g, '_')]))
    .filter((article) => !!article.image)
}

async function hydrate(articlesByMonth, year) {
  const all = await Promise.all(
    articlesByMonth.map((articles) => hydrateArticleList(articles, year))
  )
  return all
}

// Creates test cases based on the top Wikipedia articles obtained from getMonthlyTopArticles.
/**
 * @param {Object} options
 * @param {string} [options.project]
 * @param {string} [options.query]
 * @param {string} [options.source]
 * @param {number} [options.limit]
 * @return {array}
 */
async function querymonthlyTopArticles(options) {
  const { project = 'en.wikipedia', limit = 15, year = '2024' } = options
  const currentDate = new Date()
  const totalMonths = year == currentDate.getFullYear() ? currentDate.getMonth() : 12

  let queries = []
  for (let i = 1; i <= totalMonths; i++) {
    const month = i < 10 ? `0${i}` : i.toString()
    queries.push(getMonthlyTopArticles(project, limit, year, month))
  }
  const topArticles = await Promise.all(queries)

  if (!topArticles) {
    console.error('Failed to fetch.')
    return null
  }

  return hydrate(topArticles, year)
}

function getYearlyTopArticles(monthlyTopArticles) {
  const aggregateArticles = {}
  monthlyTopArticles.flat(1).forEach((a) => {
    if (aggregateArticles[a.article]) {
      aggregateArticles[a.article].views += a.views
    } else {
      aggregateArticles[a.article] = a
      delete aggregateArticles[a.article].month
      delete aggregateArticles[a.article].rank
    }
  })
  const yearlyTopArticles = Object.values(aggregateArticles).sort((a, b) => {
    return b.views - a.views
  })
  return yearlyTopArticles
}

function categorizeTopArticles(topArticles, year) {
  const byCategory = {}
  catFn(year).forEach((categoryObj) => {
    const category = categoryObj.title
    byCategory[category] = topArticles.filter(
      (a) => a.categories.includes(category) || a.categories.includes(category.replace(/_/g, ' '))
    )
  })
  return byCategory
}

async function getTopArticles(options) {
  const monthlyTopArticles = await querymonthlyTopArticles(options)
  const yearlyTopArticles = getYearlyTopArticles(monthlyTopArticles)
  return {
    monthlyTopArticles,
    yearlyTopArticles
  }
}
export { getTopArticles, hydrateArticleList }
