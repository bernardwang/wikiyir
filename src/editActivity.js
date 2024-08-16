async function getEditActivity(project, year, month, days = 'all-days') {
  const prefix = 'https://wikimedia.org/api/rest_v1/metrics';
  const url = `${prefix}/edited-pages/top-by-edits/${project}/all-editor-types/all-page-types/${year}/${month}/${days}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const topEditedPages = await response.json();

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

export { getEditActivity };