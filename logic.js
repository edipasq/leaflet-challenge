function createMap(earthquakesdata,testing) {
   console.log('maps')
   basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: api_key
});

var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: api_key
});

var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: api_key
});

   var map = L.map("map", {
    center: [33.9838333, -116.8241667],
    zoom: 5,
    layers: [satellitemap,earthquakesdata]
  });

// Create the tile layer that will be the background of our map.
 
 var baseMaps = {
    
    "satellitemap": satellitemap,
    "outdoors":outdoors,
    "graymap":graymap
  };

  var overlayMaps = {
    "Earthquakes": earthquakesdata
  };

  console.log(testing);
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);


  var legend = L.control({position: 'bottomright'});
legend.onAdd = function(){
        console.log("here");
        var div = L.DomUtil.create('div', 'legend');
        var labels = ['-10-10','10-30','30-50','50-70','70-90','90+'];
        var categories = [10,30,50,70,90,100];
        var legendinfo1 = "<h1>Earthquake</h1>" +
        "<div class=\"labels\">" +
        
      "</div>";
      var labels2 = [];
    for (var i=0; i < categories.length; i++){
      labels2.push('<li style\="background:' + Choosecolor(categories[i]) +'"\">' +labels[i] +'</li>') ;

    }
    div.innerHTML = legendinfo1;
    div.innerHTML += "<ul>" + labels2.join("") + "</ul>";
    
    
    return div;

    };
legend.addTo(map);
}  


function markerSize(magnitude) {
    return magnitude * 5000;
  }
  
function Choosecolor(depth){
    
    if (depth <= 10){
      return "LimeGreen";
    }else if (depth > 10 && depth <= 30){
      return "yellow";
    }else if (depth > 30 && depth <=50){
      return "LightSalmon";
    }else if (depth > 50 && depth <=70){
      return "Orange";
    }else if (depth > 70 && depth <=90){
      return "OrangeRed";
    }else {
      return "FireBrick";
    }
};

function createMarkers(response,response2) {
    console.log(response);
    console.log(response2);
    var Earthquake = response.features;
    var plates = response2.features;
  // Initialize an array to hold bike markers.
  var earthquakeMarkers = [];
  var plateMarkers = [];
  for (var i = 0; i < Earthquake.length; i++) {
    // Setting the marker radius for the state by passing population into the markerSize function
    coordin = [Earthquake[i].geometry.coordinates[1],Earthquake[i].geometry.coordinates[0]];
    var radi = markerSize(Earthquake[i].properties.mag);
    earthquakeMarkers.push
        (L.circle(coordin, {
         
          fillOpacity: 0.75,
          color: "white",
          fillColor: Choosecolor(Earthquake[i].geometry.coordinates[2]),
          radius: radi
        }).bindPopup(`<h1>${Earthquake[i].properties.place}</h1> <hr> <h3>Magnitude: ${Earthquake[i].properties.mag} Depth: ${Earthquake[i].geometry.coordinates[2]}</h3>`));
  
    }
   
    
  // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
  createMap(L.layerGroup(earthquakeMarkers));
  
};




var plateslink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
var link2 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";
var link1 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";


//d3.json(link1).then(createMarkers);

d3.json(link1)
  .then((data1) => {
      console.log(data1);
      d3.json(plateslink).then((data2) => {
      console.log(data2);
      createMarkers(data1,data2);
  });
  });

