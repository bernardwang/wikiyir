import { TopArticlesAPI, EditActivityAPI, EditorActivityAPI} from './src/services/api/index.js';

import fs from 'fs';

const sleep = ( seconds ) => new Promise( ( resolve ) => {
    setTimeout( () => {
        resolve();
    }, seconds * 1000 );
} );

const years = [ '2020', '2021', '2022', '2023', '2024' ];
const projects = [ 'en.wikipedia' ];

for ( let i = 0; i < projects.length; i++ ) {
    for ( let j = 0; j < years.length; j++ ) {
        const project = projects[i];
        const year = years[j];
        await sleep( 5 );
        const editorStats = await EditorActivityAPI.getEditorActivity( project, year );
        const editStats = await EditActivityAPI.getEditActivity( project, year );
        await sleep( 5 );
        const json = await TopArticlesAPI.getTopArticles({ project, limit: 10, year });
        fs.writeFileSync( `public/${year}-${project}.json`, JSON.stringify( Object.assign( {}, json, editorStats, editStats ) ) );
    }
}