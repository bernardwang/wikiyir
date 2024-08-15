async function getEditActivity(project, year, month, days="all-days") {
    const prefix = 'https://wikimedia.org/api/rest_v1/metrics';
    const url = `${prefix}/edited-pages/top-by-edits/${project}/all-editor-types/all-page-types/${year}/${month}/${days}`
    const topEditedPages = await fetch(url).then((resp) => resp.json());

    // Extract the top edited pages from the API response
    const topPagesResult = topEditedPages.items[0].results[0].top;

    const filteredPrefixes = ['Project:', 'User:', 'Project talk:'];
    const filteredTopPagesResult = topPagesResult.filter(article => !filteredPrefixes.some(prefix => article.page_title.startsWith(prefix)));

    // Map the data to include only title and number of edits
    const mostEditedArticles = filteredTopPagesResult.map(article => ({
        title: article.page_title.replace(/_/g, ' '),
        edits: article.edits
    }));

    // Sort the articles by number of edits in descending order
    mostEditedArticles.sort((a, b) => b.edits - a.edits);

    // Limit the result to top 10 articles
    const top10MostEditedArticles = mostEditedArticles.slice(0, 10);

    return { mostEditedArticles: top10MostEditedArticles };
}

export { getEditActivity };