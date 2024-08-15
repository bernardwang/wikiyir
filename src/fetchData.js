import { getTopArticles } from "./topArticles.js";
import { getEditorActivity } from './editorActivity.js';
import { getEditActivity } from './editActivity.js';

export default async function fetchData( options ) {
    try {
        const cache = await fetch( `./${options.year}-${options.project}.json` )
            .then( resp => resp.json() );
        if ( !cache.numEditors ) {
            throw new Error( 'Ignore cache! Outdated!' );
        }
        return cache;
    } catch ( e ) {
        const topArticles = await getTopArticles( options );
        const editorStats = await getEditorActivity( options.project, options.year );
        const mostEditedArticles = await getEditActivity( options.project, options.year, "01" );
        return Object.assign( {}, topArticles, editorStats, mostEditedArticles )
    }
};
