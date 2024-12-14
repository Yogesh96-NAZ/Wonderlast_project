maptilersdk.config.apiKey = mapToken;
    const map = new maptilersdk.Map({
        container: 'map', 
        style: maptilersdk.MapStyle.STREETS,
        center: coordinates, 
        zoom: 9, 
    });

// Add a marker to the map at the coordinates
const marker = new maptilersdk.Marker({ color: "red" })
.setLngLat(coordinates) 
.setPopup(new maptilersdk.Popup({offset: 25})
.setHTML("<h3>Welcom to Wonderlust</h3>"))
.addTo(map);
 
