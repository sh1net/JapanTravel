import React, { useState } from 'react'
import { YMaps, Map, FullscreenControl, GeolocationControl, ZoomControl, SearchControl, Placemark } from 'react-yandex-maps'

function CheckMapLocation() {
    const [placemark, setPlacemark] = useState([35.689605627350275, 139.76551081554814]);

    const API_KEY = '06670076-6f50-429a-a6b8-a5f3fdcd22b3'

    return (
        <YMaps query={{ apikey: API_KEY }}>
            <Map
                defaultState={{ center: placemark, zoom: 10 }}
                options={{
                  yandexMapDisablePoiInteractivity: true, // Отключает взаимодействие с POI (Point of Interest)
                  suppressMapOpenBlock: true, // Подавляет отображение блока с информацией об открытой карте
                  suppressObsoleteBrowserNotifier: true, // Подавляет уведомление о несовместимости с браузерами
                  avoidFractionalZoom: false, // Позволяет использовать дробные значения масштаба карты
                  suppressMapOpenBlock: true, // Подавляет уведомление о несовместимости с браузерами
                  mapLayers: ['map', 'satellite', 'hybrid'], // Список слоев карты (map - схема, satellite - спутник, hybrid - гибрид)
                  mapType: 'map', // Тип карты по умолчанию (map - схема, satellite - спутник, hybrid - гибрид)
                  searchControlProvider: 'yandex#search' // Провайдер поискового контроля
              }}
            >
                <FullscreenControl />
                <GeolocationControl options={{ float: 'right' }} />
                <ZoomControl options={{ size: 'small' }} />
                {/* <SearchControl options={{ float: 'right' }} /> */}
                <Placemark geometry={placemark} />
            </Map>
        </YMaps>
    )
}

export default CheckMapLocation
