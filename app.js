function initMap() {
  var raleighParks = 'http://data-ral.opendata.arcgis.com/datasets/5a211ae2f9974f3b814438d5f3a5d783_12.geojson';

  var styledMapType = new google.maps.StyledMapType(darkMatter, {name: 'Dark Base'});

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.779590, lng: -78.638179},
    zoom: 13,
    fullscreenControl: false,
    mapTypeControlOptions: {
      mapTypeIds: ['satellite','hybrid','styled_map']
    }
  });
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');

  map.setTilt(45);
  map.data.loadGeoJson(raleighParks);
  map.data.setStyle({
    fillOpacity: 0,
    strokeColor: 'whitesmoke',
    strokeWeight: 1.5
  });
  map.data.addListener("click", function(e) {
    map.data.revertStyle();
    map.data.overrideStyle(e.feature, {
      strokeWeight: 3,
      strokeColor: 'turquoise'
    });

    var bounds = new google.maps.LatLngBounds();
    processPoints(e.feature.getGeometry(), bounds.extend, bounds);
    map.fitBounds(bounds);

    document.getElementById("info-box-name").textContent = e.feature.getProperty("NAME");
    document.getElementById("info-box-type").textContent = "Type: " + e.feature.getProperty("PARK_TYPE");
    document.getElementById("info-box-acres").textContent = "Size: " + e.feature.getProperty("MAP_ACRES").toFixed(2) + " ac.";
  });
}
function processPoints(geometry, callback, thisArg) {
  if (geometry instanceof google.maps.LatLng) {
    callback.call(thisArg, geometry);
  } else if (geometry instanceof google.maps.Data.Point) {
    callback.call(thisArg, geometry.get());
  } else {
    geometry.getArray().forEach(function(g) {
      processPoints(g, callback, thisArg);
    });
  }
}
