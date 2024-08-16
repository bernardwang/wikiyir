import { TopArticlesAPI, EditorActivityAPI, EditActivityAPI} from '@/services/api';

export default async function fetchData(options) {
  try {
    const cache = await fetch(`./${options.year}-${options.project}.json`).then(resp => resp.json());
    if (!cache.numEditors) {
      throw new Error('Ignore cache! Outdated!');
    }
    return cache;
  } catch (e) {
    const [topArticles, editorStats, mostEditedArticles] = await Promise.all([
      TopArticlesAPI.getTopArticles(options),
      EditorActivityAPI.getEditorActivity(options.project, options.year),
      EditActivityAPI.getEditActivity(options.project, options.year, "01")
    ]);

    return { ...topArticles, ...editorStats, ...mostEditedArticles };
  }
}