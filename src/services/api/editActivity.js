import { fetchWithErrorHandling } from './utils.js';

class EditActivityAPI {
  static async getEditActivity(project, year, month = '01', days = 'all-days') {
    const prefix = 'https://wikimedia.org/api/rest_v1/metrics';
    const url = `${prefix}/edited-pages/top-by-edits/${project}/all-editor-types/all-page-types/${year}/${month}/${days}`;

    try {
      const topEditedPages = await fetchWithErrorHandling(url);

      const topPagesResult = topEditedPages.items[0]?.results[0]?.top ?? [];
      const filteredPrefixes = ['Project:', 'User:', 'Project talk:'];

      const mostEditedArticles = topPagesResult
        .filter(article => !filteredPrefixes.some(prefix => article.page_title.startsWith(prefix)))
        .map(article => ({
          title: article.page_title.replace(/_/g, ' '),
          edits: article.edits
        }))
        .sort((a, b) => b.edits - a.edits)
        .slice(0, 10);

      return { mostEditedArticles };
    } catch (error) {
      console.error('Error fetching edit activity:', error);
      throw error;
    }
  }

  static async getEditActivityForYear(project, year) {
    const allMonths = await Promise.all(
      Array.from({ length: 12 }, (_, i) => {
        const month = String(i + 1).padStart(2, '0');
        return this.getEditActivity(project, year, month);
      })
    );

    const combinedArticles = allMonths.flatMap(month => month.mostEditedArticles);
    const yearlyMostEdited = combinedArticles
      .reduce((acc, article) => {
        const existing = acc.find(a => a.title === article.title);
        if (existing) {
          existing.edits += article.edits;
        } else {
          acc.push({ ...article });
        }
        return acc;
      }, [])
      .sort((a, b) => b.edits - a.edits)
      .slice(0, 10);

    return { mostEditedArticles: yearlyMostEdited };
  }
}

export default EditActivityAPI;