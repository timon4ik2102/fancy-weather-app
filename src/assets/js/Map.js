async function displayMap(lng, lat) {
    mapboxgl.accessToken = 'pk.eyJ1IjoidGltb240aWsxOTg0IiwiYSI6ImNrM3I2bW83ODA4Z2QzbmxoYzhhemV0bTgifQ.uVdwxgWhiSeVzezLnB2WAw';
    const map = await new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: 10,
        logoPosition: 'top-left',
        attributionControl: false,
        trackUserLocation: true,
        showUserLocation: true,
    });
    const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
}

export { displayMap as default };
