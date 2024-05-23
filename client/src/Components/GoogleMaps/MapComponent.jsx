import React from 'react';
import {YMaps, Map, FullscreenControl, GeolocationControl, ZoomControl, Placemark} from "react-yandex-maps"

const MapComponent = ({location,name}) => {

  const API_KEY='0793f2fa-37aa-4201-aae9-7538489c7453'

  // const [latitude,setLatitude] = useState()
  // const [longitude,setLongitude] = useState()

  // useEffect(()=>{
  //   fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY}&geocode=${encodeURIComponent('СвятилищеФусими Инари')}&format=json`)
  //   .then(response=>response.json())
  //   .then(data=>{
  //     const coordinates = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ');
  //     setLatitude(parseFloat(coordinates[1]));
  //     setLongitude(parseFloat(coordinates[0]));
  //     console.log(name, latitude, longitude);
  //   })
  //   .catch(error => console.error('Ошибка при получении координат:', error));
  // },[name])

  return (
    <YMaps query={{apikey: API_KEY}}>
        <Map defaultState={{center:[location[0], location[1]], zoom: 16}} style={{height:'400px'}}>
          <Placemark geometry={[location[0], location[1]]} properties={{ iconCaption: name }} />
          <FullscreenControl />
          <GeolocationControl options={{ float: 'right' }} />
          <ZoomControl options={{ size: 'small' }} />
        </Map>
    </YMaps>
  );
}

export default MapComponent;
