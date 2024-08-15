import { getTopArticles } from "./topArticles.js";
import { getEditorActivity } from './editorActivity.js';

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
        return Object.assign( {}, topArticles, editorStats )
    }
};
