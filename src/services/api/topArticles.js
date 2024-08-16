import { fetchWithErrorHandling } from './utils.js';
import catFn from './categories.js';
import { MONTHS } from './chartUtils.js';

class TopArticlesAPI {
  static async getTopArticles(options) {
    const { project = 'en.wikipedia', limit = 15, year = '2024' } = options;
    const months = this.getMonthsList(year);
    const topArticles = await Promise.all(
      months.map(month => this.getMonthlyTopArticles(project, limit, year, month))
    );

    if (!topArticles) {
      console.error('Failed to fetch top articles.');
      return null;
    }

    const hydratedArticles = await this.hydrate(topArticles, year);
    const yearlyTopArticles = this.getYearlyTopArticles(hydratedArticles);
    const categorizedYearlyTopArticles = this.categorizeArticles(yearlyTopArticles, year);

    return {
      monthlyTopArticles: hydratedArticles,
      yearlyTopArticles,
      categorizedYearlyTopArticles
    };
  }

  static async getMonthlyTopArticles(project, limit = 1, year = '2023', month = '01', mainNSOnly = true, excludeMainPage = true) {
    const endpoint = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/${project}/all-access/${year}/${month}/all-days`;
    try {
      const data = await fetchWithErrorHandling(endpoint);
      const articles = data.items[0].articles
        .filter(a => (mainNSOnly ? a.article.indexOf(':') === -1 : true))
        .filter(a => (excludeMainPage ? a.article != 'Main_Page' : true))
        .filter(this.filterOut)
        .slice(0, limit)
        .map(a => ({
          ...a,
          project,
          year,
          month,
          url: this.generateArticleUrl(a, project)
        }))
        .slice(0, 10);
      return articles;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  static filterOut(item) {
    const excludedArticles = [
      'Bible', 'Google_logo', 'Wikipedia', 'Special:Search', 'Taylor_Swift',
      'Indian_Premier_League', 'Porno_y_helado', 'WrestleMania_XL', 'Facebook',
      'Jeffrey_Epstein', 'Saltburn_(film)', 'Griselda_Blanco', '2024_Indian_Premier_League',
      'Deaths_in_2024', 'Instagram', 'Index_(statistics)', 'YouTube', 'Main_Page',
      'Cleopatra', 'Pornhub', 'XXXTentacion', '.xxx', 'Juneteenth', 'Indian_Premier_League'
    ];
    return !excludedArticles.includes(item.article.replace(/ /g, '_')) && !item.article.includes('List_of');
  }

  static generateArticleUrl(article, project) {
    const host = `https://${project}.org`.replace(/https:\/\/([^.]*)\.wiki/, 'https://$1.wiki');
    const encodedTitle = encodeURIComponent(article.article);
    return `${host}/wiki/${encodedTitle}`;
  }

  static async hydrate(articlesByMonth, year) {
    const all = await Promise.all(articlesByMonth.map(articles => this.hydrateArticles(articles, year)));
    return all;
  }

  static async hydrateArticles(articles, year) {
    const categories = catFn(year).map(a => encodeURIComponent(a.title)).join('|');
    const titles = articles.map(article => encodeURIComponent(article.article)).join('|');
    const url = `https://en.wikipedia.org/w/api.php?pithumbsize=400&pilimit=max&origin=*&action=query&format=json&prop=pageimages%7Ccategories&titles=${titles}&formatversion=2&clprop=&clshow=!hidden&clcategories=${categories}`;
    
    const json = await fetchWithErrorHandling(url);
    const lookup = {};
    json.query.pages.forEach(page => {
      const dbkey = page.title.replace(/ /g, '_');
      lookup[dbkey] = {
        image: page.thumbnail ? page.thumbnail.source : null,
        categories: (page.categories || []).map(c => c.title)
      };
    });
    
    return articles
      .map(article => Object.assign({}, article, lookup[article.article.replace(/ /g, '_')]))
      .filter(article => !!article.image);
  }

  static getYearlyTopArticles(monthlyTopArticles) {
    const aggregateArticles = {};
    monthlyTopArticles.flat(1).forEach(a => {
      if (aggregateArticles[a.article]) {
        aggregateArticles[a.article].views += a.views;
        aggregateArticles[a.article].chart.push({ x: MONTHS[Number(a.month)], y: a.views });
      } else {
        aggregateArticles[a.article] = a;
        aggregateArticles[a.article].chart = [{ x: MONTHS[Number(a.month)], y: a.views }];
        delete aggregateArticles[a.article].month;
        delete aggregateArticles[a.article].rank;
      }
    });
    const yearlyTopArticles = Object.values(aggregateArticles).sort((a, b) => b.views - a.views);
    return yearlyTopArticles.slice(0, 10);
  }

  static categorizeArticles(topArticles, year) {
    const byCategory = [];
    catFn(year).forEach(categoryObj => {
      const category = categoryObj.title;
      byCategory.push(
        topArticles.filter(a => 
          a.categories.includes(category) || a.categories.includes(category.replace(/_/g, ' '))
        )
      );
    });
    return byCategory;
  }

  static getMonthsList(year) {
    const currentDate = new Date();
    const totalMonths = year == currentDate.getFullYear() ? currentDate.getMonth() : 12;
    return Array.from({ length: totalMonths }, (_, i) => (i + 1).toString().padStart(2, '0'));
  }

  static async getArticleHistory(article, project, year) {
    const title = encodeURIComponent(article.article);
    const months = this.getMonthsList(year);
    const viewsData = await Promise.all(
      months.map(async month => {
        const lastDate = new Date(year, month, 0).getDate();
        const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/${project}.org/all-access/all-agents/${title}/daily/${year}${month}01/${year}${month}${lastDate}`;
        const json = await fetchWithErrorHandling(url);
        return json.items.map(i => ({
          timestamp: i.timestamp,
          views: i.views
        }));
      })
    );
    return viewsData.flat(1);
  }
}

export default TopArticlesAPI;