import { getTopArticles } from "./src/topArticles.js";
import fs from 'fs';

[ '2020', '2021', '2022', '2023', '2024' ].forEach( ( year ) => {
    [ 'en.wikipedia' ].forEach( async ( project ) => {
        const json = await getTopArticles({ project, limit: 10, year });
        fs.writeFileSync( `public/${year}-${project}.json`, JSON.stringify( json ) );
    } );
} );
