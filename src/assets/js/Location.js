import displayMap from './Map';
import { errorInformation, locationTime, bodyBlock, locationCity } from './Constants';
import { changeBackground } from './BackgroundImage';
import { translationData } from './TranslateData';
import getUserLocationName from './TranslateCity';
import getWeatherForecast from './Weather';

// export const locationCity = {};

export async function getTimeOffset(lat, lng) {
    const API_GATEWAY = 'https://api.timezonedb.com/';
    const API_KEY = 'XM23RFKXPW3D';
    return fetch(`${API_GATEWAY}v2.1/get-time-zone?key=${API_KEY}&format=json&by=position&lat=${lat}&lng=${lng}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'FAILED') {
                errorInformation.innerText = 'Timezone is not defined. Last time in use';
            } else {
                locationCity.offset = data.gmtOffset / 3600;
            }
        });
}

// export async function showCityName(cityName, countryName) {
//     locationCity.header = `${cityName}, ${countryName}`;
//     await translateCityName(`${cityName}, ${countryName}`, localStorage.getItem('language'));
// }

export async function convertDMS(lat, lng) {
    const convertLat = Math.abs(lat);
    const LatDeg = Math.floor(convertLat);
    const LatMin = Math.floor((convertLat - LatDeg) * 60);
    const LatCardinal = lat > 0 ? 'N' : 'S';
    const convertLng = Math.abs(lng);
    const LngDeg = Math.floor(convertLng);
    const LngMin = Math.floor((convertLng - LngDeg) * 60);
    const LngCardinal = lng > 0 ? 'E' : 'W';
    locationCity.latitude = `${LatDeg}°  ${LatMin} ' ${LatCardinal}`;
    locationCity.longitude = ` ${LngDeg}°  ${LngMin}' ${LngCardinal}`;
}

export async function getLocation(searchItem) {
    try {
        await getUserLocationName(searchItem, localStorage.getItem('language'));
        // console.log(country);
        // console.log(searchCity);
        // await showCityName(locationCity.city, locationCity.country);
        await getTimeOffset(locationCity.lat, locationCity.lng);
        await convertDMS(locationCity.lat, locationCity.lng);
        await displayMap(locationCity.lng, locationCity.lat);
        await getWeatherForecast(locationCity.lat, locationCity.lng, localStorage.getItem('units'), localStorage.getItem('language'));
        await changeBackground(locationTime.yearTime, locationTime.dayTime, bodyBlock);
    } catch (err) {
        errorInformation.innerText = `${translationData.translate.input[localStorage.getItem('language')].toUpperCase()}`;
    }
}
