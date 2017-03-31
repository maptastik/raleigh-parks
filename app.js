function initMap() {
  var raleighParks = 'http://data-ral.opendata.arcgis.com/datasets/5a211ae2f9974f3b814438d5f3a5d783_12.geojson';
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.779590, lng: -78.638179},
    zoom: 13,
    mapTypeId: 'hybrid'
  });
  map.setTilt(45);
  map.data.loadGeoJson(raleighParks);
  map.data.setStyle({
    fillOpacity: 0,
    strokeColor: 'white',
    strokeWeight: 2
  });
  map.data.addListener("click", function(e) {
    map.data.revertStyle();
    map.data.overrideStyle(e.feature, {
      strokeWeight: 3
    })
    document.getElementById("info-box-name").textContent = e.feature.getProperty("NAME")
    document.getElementById("info-box-type").textContent = "Type: " + e.feature.getProperty("PARK_TYPE")
  })
}
