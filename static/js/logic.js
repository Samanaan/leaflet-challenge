
// Create base map layers and starting position
// Come back to this to edit and clean up but IT IS DONE !!!!!!

// Create the tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create a baseMaps object to hold the streetmap layer.
let baseMaps = {
    "Street Map": streetmap
};

// Create a overlayMap and layermap object to hold the Earthquake_Epicenters layer and overlay.
let layerMap = {
    Earthquake_Epicenters: new L.LayerGroup(),
};

let overlayMap = {
    "Earthquake_Epicenters": layerMap.Earthquake_Epicenters
 };


// Create the map object with options.
let map = L.map("map", {
    center: [40.73, -110.0059],
    zoom: 5,
    layers: [streetmap, layerMap.Earthquake_Epicenters]
});

// Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
L.control.layers(baseMaps, overlayMap, {
    collapsed: false
}).addTo(map);

    
/*-------------------------------------------------------------- */
//Marker Creation
/*-------------------------------------------------------------- */

url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


d3.json(url).then(function(infoQuakes) {
    
    //LEGEND!!!!!
    var minValue = 0;
    var maxValue = 100;
    var colorScale = chroma.scale(['blue', 'green']).domain([minValue, maxValue]);

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');

    // Add a title for the legend
    div.innerHTML += '<h4>Legend Title</h4>';

    // Create the color scale legend with continuous color bar and tick marks
    var colorBar = '<div id="color-bar"></div>';
    div.innerHTML += colorBar;

    // Get the DOM element of the color bar
    var colorBarElement = div.querySelector('#color-bar');

    // Update the style of the color bar using linear gradients
    colorBarElement.style.background =
        'linear-gradient(to right, ' +
        colorScale(minValue).hex() +
        ', ' +
        colorScale(maxValue).hex() +
        ')';

    // Define the number of tick marks
    var numTicks = 5;
    var tickSize = 100 / (numTicks - 1);

    // Create the tick marks
    for (var i = 0; i < numTicks; i++) {
        var value = minValue + (i * (maxValue - minValue) / (numTicks - 1));
        var tickMark = document.createElement('div');
        tickMark.className = 'tick-mark';
        tickMark.style.left = i * tickSize + '%';

        // Create the tick label
        var tickLabel = document.createElement('span');
        tickLabel.className = 'tick-label';
        tickLabel.style.left = i * tickSize + '%';
        tickLabel.textContent = value.toFixed(2); // Adjust the formatting as needed

        colorBarElement.appendChild(tickMark);
        colorBarElement.appendChild(tickLabel);
    }

    return div;
    };

    legend.onRemove = function (map) {
    // Cleanup code if needed
    };

    // Add the legend to the map
    legend.addTo(map);




    // depth i.e. oneQuake.geometry.coordinates[2]
    let quakesInfo = infoQuakes.features;
    
    for (let i = 0; i < quakesInfo.length; i++) {
        let oneQuake = quakesInfo[i];

        var value = oneQuake.geometry.coordinates[2];
        var color = colorScale(value).hex();

        //Create a new marker with the correct coordinates
        let newMarker = L.circleMarker([oneQuake.geometry.coordinates[1], oneQuake.geometry.coordinates[0]], {
            // multiply the magnitude of the erathquake by five so that the radius of the marker is more pronounced.
            radius: oneQuake.properties.mag * 5,
            fillColor: color,
            color: 'black',
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.5,
        });

        //Add the new marker to the appropriate layer.
        newMarker.addTo(overlayMap["Earthquake_Epicenters"]);

        // Bind a popup to the marker that will  display on being clicked. This will be rendered as HTML.
        //Info to display: Where, Mag, Depth, Time (If possible)
        newMarker.bindPopup(oneQuake.properties.place + "<br> Magnitude: " + oneQuake.properties.mag.toString() + "<br> Depth: " + oneQuake.geometry.coordinates[2].toString() + "<br> Date: " + Date(oneQuake.properties.time));

    }

});