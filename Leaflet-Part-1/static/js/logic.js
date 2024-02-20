// Earthquake data : https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php

// All Earthquakes from last 7 days

const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

const colors = ['RGB(54, 189, 9)', 
                'RGB(164, 219, 68)', 
                'RGB(222, 191, 18)', 
                'RGB(222, 161, 18)', 
                'RGB(222, 103, 18)', 
                'RGB(222, 18, 18)'];

// Retrieve last 7 days Earthquake data
d3.json(url).then(function(data) {
    createFeatures(data.features);
});

// Create Map object function
function createMap(earthquakes) {

    // Create the base layer.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    //Create a baseMap object
    let baseMap = {
        "Street Map" : street
    };

    // Create an overlay object
    let overlayMap = {
        "Earthquakes" : earthquakes
    };

    //Create Map
    let myMap = L.map("map", {
        center: [39, -116],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Add layers to the Map
    L.control.layers(baseMap, overlayMap, {
        collapsed: false
    }).addTo(myMap);

    // Set up the legend.
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let depths = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
    let labels = [];

    depths.forEach(function(depth, index) {
      labels.push("<i class=\"square\" style=\"background-color: " 
      + colors[index] + "\"></i><span>" + depth + "</span>")
    });

    div.innerHTML +=  "<div class=\"labels\">"  + labels.join("<br>") + "</div>";
    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);


};

// Function that returns color based on depth
function getColor(depth) {

    let color = "";

    if(depth < 11)
        color = colors[0];
    else if(depth < 31 )
        color = colors[1];
    else if(depth < 51)
        color = colors[2];
    else if(depth < 71)
        color = colors[3];
    else if(depth < 91)
        color = colors[4];
    else 
        color = colors[5];

    return color;
}

// Function to create features for earthquake data
function createFeatures(features) {

    // Define a function that will run once for each feature
    // Give each feature a popup that describes the place and time
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`)
    }
    // Alter the points to show a circle with color and size variance accoriding to the size and depth
    function pointToLayer(feature, latlng) {
        return L.circleMarker(latlng, {
            weight: 1,
            fillOpacity: 0.75,
            opacity: 1,
            color: "grey",
            fillColor: getColor(feature.geometry.coordinates[2]),
            radius: feature.properties.mag * 2.5
        })
    }

    // Create a GeoJSON later that contains features array on the earthquakeData object
    // Run the OnEachFeature function once for each data in the array
    let earthquakes = L.geoJSON(features, {
        onEachFeature : onEachFeature,
        pointToLayer: pointToLayer
    });

    createMap(earthquakes);

}

