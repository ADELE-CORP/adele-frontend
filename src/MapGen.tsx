import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default function NorthMacedoniaMap() {
    const [monumentsData, setMonumentsData] = useState(null);

    const customIcon = new L.Icon({
        iconUrl: '/pin.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });

    const northMacedoniaBounds: L.LatLngBoundsExpression = [
        [40.853659, 20.452902],
        [42.373535, 23.034051]
    ];

    useEffect(() => {
        fetch('http://localhost:3000/data')
            .then(res => res.json())
            .then(data => setMonumentsData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const onEachMonument = (feature: any, latlng: any) => {
        if (feature.geometry && feature.geometry.type === "Point") {
            const marker = L.marker(latlng, { icon: customIcon });

            if (feature.properties && feature.properties.name) {
                marker.bindPopup(`<Popup>${feature.properties.name}</Popup>`);
            }

            return marker;
        }
    };

    return (
        <MapContainer
            center={[41.6086, 21.7453]}
            zoom={7}
            style={{ width: '100vw', height: "100vh" }}
            maxBounds={northMacedoniaBounds}
            minZoom={7}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {monumentsData &&
                <GeoJSON
                    data={monumentsData}
                    pointToLayer={onEachMonument as any}
                />
            }
        </MapContainer>
    );
}