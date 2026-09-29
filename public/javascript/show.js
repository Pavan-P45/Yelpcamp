const mapElement = document.getElementById("map");

const coordinates = JSON.parse(mapElement.dataset.coordinates);
const title = mapElement.dataset.title;
const campgroundlocation = mapElement.dataset.location;

const map = L.map("map").setView(
    [coordinates[1], coordinates[0]],
    13
);

L.tileLayer(
    `https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png?key=${CARTO_MAP_KEY}`,
    {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20
    }
).addTo(map);

L.marker([coordinates[1], coordinates[0]])
    .addTo(map)
    .bindPopup(`<b>${title}<br>${campgroundlocation}</b>`)
    .openPopup();