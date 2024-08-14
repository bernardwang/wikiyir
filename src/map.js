function initMap() {
  const mapElem = document.getElementById('map')
  const map = new Datamap({
    element: mapElem,
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

  //TODO: Wire up API call when clicking on each country and showing a popup
  document.querySelector('.USA').addEventListener('click', function () {
    console.log(1)
  })
}

export default initMap
