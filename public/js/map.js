// grab the address element from the DOM. It should contain a data-set id thet holds the latitude and longitude of the current attraction you're looking at
let element = document.querySelector("#address");

let latitude = element.childNodes[3].dataset.latitude;
let longitude = element.childNodes[3].dataset.longitude;

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxleHNhbjE5IiwiYSI6ImNsYXlmdWxlMTBiYnEzd3J6eHcwbHQ5M2YifQ.4Kzuy0Ca1z1at5g8G6R1mA";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [longitude, latitude],
  zoom: 16,
});

// Add marker icon
const marker = new mapboxgl.Marker()
  .setLngLat([longitude, latitude])
  .addTo(map);

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
