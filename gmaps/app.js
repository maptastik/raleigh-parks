function initMap() {
  // STARTER VARIABLES
  // Raleigh parks data
  var raleighParks = 'http://data-ral.opendata.arcgis.com/datasets/5a211ae2f9974f3b814438d5f3a5d783_12.geojson';
  // Map style
  var darkBaseStyle = new google.maps.StyledMapType(darkMatter, {name: 'Dark Base'});
  // Map bounds (Empty)
  var bounds = new google.maps.LatLngBounds();
  // Interaction states
  var clicked = false;
  var hover = true;

  // SETUP MAP
  var map = new google.maps.Map(document.getElementById('map'), {
    // center: {lat: 35.779590, lng: -78.638179},
    // zoom: 13,
    fullscreenControl: false,
    mapTypeControlOptions: {
      mapTypeIds: ['satellite','hybrid','dark_base']
    }
  });
  map.setTilt(45);
  map.mapTypes.set('dark_base', darkBaseStyle);
  map.setMapTypeId('dark_base');

  // PARKS DATA
  // Load data
  map.data.loadGeoJson(raleighParks);
  // Style data based on zoom level
  map.addListener('zoom_changed', function() {
    var zoom = map.getZoom();
    if(zoom <= 10){
      map.data.setStyle({
        fillOpacity: 0,
        fillColor: 'turquoise',
        strokeColor: 'whitesmoke',
        strokeWeight: 1
      });
    } else {
      map.data.setStyle({
        fillOpacity: 0,
        fillColor: 'turquoise',
        strokeColor: 'whitesmoke',
        strokeWeight: zoom/8
      });
    }
  })

  // ZOOM MAP TO DATA EXTENT
  map.data.addListener('addfeature', function(e) {
    processPoints(e.feature.getGeometry(), bounds.extend, bounds);
    map.fitBounds(bounds);
  });

  // INTERACTION
  // Click non-feature in map
  map.addListener('click', function(){
    map.data.revertStyle();
    clicked = false;
    hover = true;
  });
  // Mouseover
  map.data.addListener('mouseover', function(e){
    document.getElementById("info-box-hover").textContent = "Click for " + e.feature.getProperty("NAME");
    if(hover && !clicked){
      map.data.revertStyle();
      map.data.overrideStyle(e.feature, {
        fillOpacity: 0.5
      });
    }
  });
  map.data.addListener('mouseout', function(e){
    document.getElementById("info-box-hover").textContent = "";
    if(!clicked && hover){
      map.data.revertStyle();
    }
  })
  // Click data feature
  map.data.addListener("click", function(e) {
    clicked = true;
    hover = false;
    // Change style of clicked feature
    map.data.revertStyle();
    map.data.overrideStyle(e.feature, {
      strokeWeight: 3,
      strokeColor: 'turquoise'
    });
    // Zoom to clicked feature
    bounds = new google.maps.LatLngBounds();
    processPoints(e.feature.getGeometry(), bounds.extend, bounds);
    map.fitBounds(bounds);
    // Update info-box
    document.getElementById("info-box-name").textContent = e.feature.getProperty("NAME");
    document.getElementById("info-box-type").textContent = "Type: " + e.feature.getProperty("PARK_TYPE");
    document.getElementById("info-box-developed").textContent = "Status: " + e.feature.getProperty("DEVELOPED");
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
