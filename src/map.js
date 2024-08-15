let currentMap;
const IGNORE_LIST = [ 'Main_Page', 'Special:Search' ];
const queries = {};

const mapIsoAlpha3ToAlpha2 = ( country ) => {
  console.log('>>', country);
  // TODO: Work out how to actually map alpha 2 to 3.
  return country.replace(/(.)[AUIOE]/g, '$1');
};
function getTopArticleForCountry( year, country ) {
  if ( !queries[country] ) {
    queries[country] = fetch(`https://wikimedia.org/api/rest_v1/metrics/pageviews/top-per-country/${mapIsoAlpha3ToAlpha2(country)}/all-access/${year}/01/01` )
      .then((resp)=>resp.json())
  }
  return queries[country].then((result) => {
    console.log(result);
    const topArticle = result.items[0].articles.filter((a)=>!IGNORE_LIST.includes(a.article))[0];
    topArticle.url = `https://${topArticle.project}.org/wiki/${topArticle.article}`;
    return topArticle;
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
      datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
          getTopArticleForCountry( year, geo.id ).then((topArticle) => {
            window.open( topArticle.url );
          } );
      });
    },
    geographyConfig: {
      popupOnHover: true,
      popupTemplate: function(geo) {
        const country = geo.properties.name;
        getTopArticleForCountry( year, geo.id ).then((topArticle) => {
          document.getElementById('mapPopup').innerHTML = `The top article in ${country} on January 1st was
<a href="${topArticle.url}">${topArticle.article}</a>`;
        });
        return `<div id="mapPopup">${country}</div>`;
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
