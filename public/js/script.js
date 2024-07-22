const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const markers = {};
let hasCenteredMap = false; // Flag to track if the map has been centered

socket.on("recieve-location", (data) => {
  const { id, longitude, latitude } = data;

  // Center the map only once
  if (!hasCenteredMap) {
    map.setView([latitude, longitude], 16); // Set the initial view
    hasCenteredMap = true; // Set the flag to true
  }

  // Debugging: Log received data
  console.log(
    `Received location for ID: ${id}, Latitude: ${latitude}, Longitude: ${longitude}`
  );

  // Update marker or add new marker
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]); // Update existing marker
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map); // Add new marker
    console.log(`Marker added for ID: ${id}`);
  }
});

socket.on("disconnect", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
    console.log(`Marker removed for ID: ${id}`);
  }
});
