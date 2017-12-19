mapboxgl.accessToken = 'pk.eyJ1IjoibWFwdGFzdGlrIiwiYSI6IjNPMkREV1kifQ.2KGPFZD0QaGfvYzXYotTXQ';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/dark-v9', //hosted style id
    center: [-78.638179, 35.779590], // starting position
    zoom: 14, // starting zoom
    pitch: 45
});

map.on('load', function(){
  parksLayer('parks-dark');
  parksInteraction();
});

var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');

function parksLayer(sourceId) {
  map.addSource(sourceId, {
    type: 'geojson',
    data: 'http://data-ral.opendata.arcgis.com/datasets/5a211ae2f9974f3b814438d5f3a5d783_4.geojson'
  })
  map.addLayer({
    'id': 'parks-line',
    'type': 'line',
    'source': sourceId,
    'layout': {},
    'paint': {
      'line-color': 'whitesmoke',
      'line-width': 1.5
    }
  })
  map.addLayer({
    'id': 'parks-fill',
    'type': 'fill',
    'source': sourceId,
    'layout': {},
    'paint': {
      'fill-color': 'whitesmoke',
      'fill-opacity': 0
    }
  }, 'water')

  map.addLayer({
    'id': 'parks-click',
    'type': 'line',
    'source': sourceId,
    'layour': {},
    'paint': {
      'line-color': 'turquoise',
      'line-width': 1.5
    },
    'filter': ['==', 'NAME', '']
  })
}

function parksInteraction(){
  map.on('click', function(e){
    var features = map.queryRenderedFeatures(e.point, {layers: ['parks-fill']});
    // Prevents an error from being thrown if you click something other than a feature
    if(!features.length){
      return;
    }
    // Get selected feature information
    var feature = features[0];
    // Zoom to clicked feature
    var bbox = turf.bbox(feature);
    var sw = new mapboxgl.LngLat(bbox[0], bbox[1]);
    var ne = new mapboxgl.LngLat(bbox[2], bbox[3]);
    var bounds = new mapboxgl.LngLatBounds(sw, ne)
    map.fitBounds(bounds, {padding: 150});
    // Highlight clicked feature
    map.setFilter('parks-click', ['==', 'NAME', feature.properties.NAME])
    // Update info box
    document.getElementById('info-box-name').textContent = feature.properties.NAME;
    document.getElementById('info-box-type').textContent = 'Type: ' + feature.properties.PARK_TYPE;
    document.getElementById('info-box-developed').textContent = 'Status: ' + feature.properties.DEVELOPED;
    document.getElementById('info-box-acres').textContent = 'Size: ' + feature.properties.MAP_ACRES.toFixed(2) + ' ac.';
  });
  map.on('mousemove', function(e){
    var features = map.queryRenderedFeatures(e.point, {layers: ['parks-fill']});
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
  });
}

function switchLayer(layer){
  // TODO Figure out why I can't remove IDs...this isn't working
  var removeParksArray = ['parks-line', 'parks-fill', 'parks-click'];
  for(var i = 0; i < removeParksArray.length; i++){
    map.removeLayer(removeParksArray[i])
  }
  if(map.isSourceLoaded('parks-dark') == true){
    console.log("thing 1 tried")

    map.removeSource('parks-dark')
  }
  if(map.isSourceLoaded('parks-sat') == true){
    console.log("thing 2 tried")
    map.removeSource('parks-sat')
  }

  var layerValue = layer.target.value;
  map.setStyle('mapbox://styles/mapbox/' + layerValue);
  map.on('style.load', function(){
    parksLayer('parks-sat');
    parksInteraction();
  })
}

for(var i = 0; i < inputs.length; i++) {
  inputs[i].onclick = switchLayer;
}
