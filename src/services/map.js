let currentMap;
const IGNORE_LIST = [ 'Main_Page' ];
import alpha from "../alpha2Lookup.json";

const queries = {};

const mapIsoAlpha3ToAlpha2 = ( country ) => {
  return alpha[country];
};

function getTopArticleForCountry( year, country ) {
  if ( !queries[country] ) {
    queries[country] = fetch(`https://wikimedia.org/api/rest_v1/metrics/pageviews/top-per-country/${mapIsoAlpha3ToAlpha2(country)}/all-access/${year}/08/01` )
      .then((resp)=> {
        console.log('got', resp, resp.status);
        if ( resp.status === 404 ) {
          return null;
        } else {
          return resp.json();
        }
      } )
  }
  return queries[country]
    .then((result) => {
      if ( result ) {
        const topArticle = result.items[0].articles
          .filter((a)=>!IGNORE_LIST.includes(a.article) && !a.article.includes(':'))[0];
        if ( topArticle ) {
          topArticle.url = `https://${topArticle.project}.org/wiki/${topArticle.article}`;
          return topArticle;
        } else {
          return false;
        }
      } else {
        return null;
      }
    });
}
function initMap( project, year ) {
  const mapElem = document.getElementById('map');
  if ( currentMap ) {
    mapElem.innerHTML = '';
  }
  const map = new Datamap({
    element: mapElem,
    done: function(datamap) {
      datamap.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
          getTopArticleForCountry( year, geo.id ).then((topArticle) => {
            if ( topArticle ) {
              window.open( topArticle.url );
            }
          } );
      });
    },
    geographyConfig: {
      popupOnHover: true,
      popupTemplate: function(geo) {
        const country = geo.properties.name;
        getTopArticleForCountry( year, geo.id ).then((topArticle) => {
          let html;
          if ( topArticle === null ) {
            html = `Information for ${country} is not available per the Wikimedia Foundation Country and Territory Protection List.`;
          } else if ( topArticle === false ) {
            html = `There was not enough page views for ${country} (${geo.id}) on 1st August`;
          } else {
            html = `The top article in ${country} on 1st August was
            <a href="${topArticle.url}">${topArticle.article.replace(/_/g, ' ')}</a>`;
          }
          document.getElementById('mapPopup').innerHTML = html;
        });
        return `<div id="mapPopup">Loading information for ${country}...</div>`;
      }
    },
    data: {
      IRL: {
        fillKey: 'LOW',
        numberOfThings: 2002
      },
      USA: {
        fillKey: 'MEDIUM',
        numberOfThings: 10381
      }
    }
  })
  currentMap = map;

}

export default initMap
