import { getTopArticles } from "./topArticles.js";
export default async function( options ) {
    try {
        const cache = await fetch( `./${options.year}-${options.project}.json` )
            .then( resp => resp.json() );
        return cache;
    } catch ( e ) {
        return getTopArticles( options );
    }
};
