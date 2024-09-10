document.addEventListener('DOMContentLoaded', () => {
const key = mapToken;
const map = L.map('map').setView([28.6139, 77.2088], 10);
L.tileLayer(`https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${key}`, {
tileSize: 512, 
zoomOffset: -1, 
minZoom: 1,
attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
crossOrigin: true
}).addTo(map);
});
