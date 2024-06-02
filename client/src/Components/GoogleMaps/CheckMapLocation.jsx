import React, { useEffect, useState } from 'react';
import { YMaps, Map, FullscreenControl, GeolocationControl, ZoomControl, Placemark } from 'react-yandex-maps';

function CheckMapLocation({ location }) {
    const [placemark, setPlacemark] = useState([0, 0]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (location && location.length > 0) {
            setPlacemark(location);
            setIsLoading(false);
        } else {
            setIsLoading(true);
            console.error('Invalid location or name provided:', location);
        }
    }, [location]);

    const API_KEY = '06670076-6f50-429a-a6b8-a5f3fdcd22b3';

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <YMaps query={{ apikey: API_KEY }}>
            <Map
                defaultState={{ center: [35.68032181259922, 139.76853503141004], zoom: 5 }}
                options={{
                    yandexMapDisablePoiInteractivity: false,
                    suppressMapOpenBlock: true,
                    suppressObsoleteBrowserNotifier: true,
                    avoidFractionalZoom: false,
                    mapType: 'map', // Тип карты "схема"
                    searchControlProvider: 'yandex#search',
                    layer: 'map' // Установка слоя карты "схема"
                }}
            >
                <Placemark geometry={placemark}/>
                <FullscreenControl />
                <GeolocationControl options={{ float: 'right' }} />
                <ZoomControl options={{ size: 'small' }} />
            </Map>
        </YMaps>
    );
}

export default CheckMapLocation;
