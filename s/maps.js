document.addEventListener('DOMContentLoaded', () => {
    // Create a global variable for markerGroup
    let markerGroup;

    // Fetch location data from the API
    fetch('/api/locations')
        .then(response => response.json())
        .then(data => initializeMap(data))
        .catch(error => console.error('Error fetching location data:', error));

    function initializeMap(locations) {
        // Define the bounds based on the image dimensions
        const imageSize = [4608, 4608];
        const bounds = [[-imageSize[0] / 2, -imageSize[1] / 2], [imageSize[0] / 2, imageSize[1] / 2]];

        // Create a new map using Leaflet with CRS.Simple
        const map = L.map('map', {
            crs: L.CRS.Simple,
            minZoom: -2,
            maxZoom: 4,
        }).setView([0, 0], 0);

        // Add a tile layer with the Calypso image
        const imageLayer = L.imageOverlay('../IImages/Maps/Calypso.png', bounds).addTo(map);

        // Create a layer group for the markers
        markerGroup = L.layerGroup().addTo(map);

        // Add controls to the map
        L.control.zoom({ position: 'topright' }).addTo(map);
        L.control.layers().addTo(map);

        // Populate the dropdown with location names
        const selectElement = document.getElementById('filterDropdown');
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location.Name;
            option.textContent = location.Name;
            selectElement.appendChild(option);
        });

        // Fetch and update markers based on user selection
        selectElement.addEventListener('change', () => {
            const selectedLocationName = selectElement.value;

            // Clear existing markers
            markerGroup.clearLayers();

            // Fetch data for the selected location from the API
            fetch(`/api/locations?locationName=${selectedLocationName}`)
                .then(response => response.json())
                .then(selectedLocationData => {
                    // Add markers for the selected location
                    const markers = selectedLocationData.map(location => {
                        const marker = L.marker([location.Lat, location.Lon]);
                        marker.bindPopup(`<h3>${location.Name}</h3><p>Type: ${location.Type}</p><p>Density: ${location.Density}</p><p>Land Area: ${location.LandArea}</p><p>Distance: ${location.Distance}</p>`);
                        return marker;
                    });

                    // Add the markers to the layer group
                    markers.forEach(marker => markerGroup.addLayer(marker));
                })
                .catch(error => console.error('Error fetching location data:', error));
        });

        // Add a control to toggle the marker overlay
        const toggleMarkersControl = L.control({ position: 'topright' });
        toggleMarkersControl.onAdd = function () {
            const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            container.innerHTML = '<div class="leaflet-control-layers-toggle" onclick="toggleMarkers()">Markers</div>';
            return container;
        };
        toggleMarkersControl.addTo(map);

        // Function to toggle the marker overlay
        window.toggleMarkers = function () {
            if (map.hasLayer(markerGroup)) {
                map.removeLayer(markerGroup);
            } else {
                map.addLayer(markerGroup);
            }
        };
    }
});
