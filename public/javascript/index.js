const mapElement = document.getElementById("map");

const campgrounds = JSON.parse(
    mapElement.dataset.campgrounds
);

const map = L.map("map");
L.tileLayer(
    `https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png?key=${CARTO_MAP_KEY}`,
    {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20
    }
).addTo(map);

const markers = L.markerClusterGroup({
    maxClusterRadius: 50,
    disableClusteringAtZoom: 14
});

for (let campground of campgrounds) {
    markers.addLayer(
        L.marker([
            campground.geometry.coordinates[1],
            campground.geometry.coordinates[0]
        ]).bindPopup(`
            <strong>
                <a href="/campground/${campground._id}">
                    ${campground.title}
                </a>
            </strong>
            <p>${campground.description.substring(0, 20)}...</p>
        `)
    );

}
map.addLayer(markers);

if (markers.getLayers().length > 0) {

    map.fitBounds(markers.getBounds(), {
        padding: [40, 40]
    });

} else {

    map.setView([20, 78], 5);

}