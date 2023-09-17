import { errorInformation } from './Constants';

import { showForecast, showInformationOnpage } from './GeneratePageData';

async function getWeatherForecast(lat, lng, unit) {
    console.log(22222222, lat, lng)
    const WEATHER_API = 'cq9tzuREsuWlzNrsewjVWs5DAY7I33lF';

    const API_GATEWAY = 'https://api.climacell.co/v3/weather/';

    const apiKey = 'bc2cd97eaa209e7d22d8f3c84081655f';
    // const apiKey = 'f56f24967aaf51182d1d4df628297c6d';

    const urlCurrent = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${apiKey}&units=${unit}`;
    // const urlCurrent = `${API_GATEWAY}realtime?lat=${lat}&lon=${lng}&unit_system=${unit}&fields=feels_like%2Ctemp%2Chumidity%2Cwind_speed%2Cweather_code&apikey=${WEATHER_API}`;
    // const urlCurrent = 'https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&appid=ac9ac2407e6b190899ab93371f0d6ea2'

    const urlDaily = `${API_GATEWAY}forecast/daily?lat=${lat}&lon=${lng}&unit_system=${unit}&start_time=now&fields=feels_like%2Ctemp%2Cweather_code&apikey=${WEATHER_API}`;
    const resCurrent = await fetch(urlCurrent);
    // const resDaily = await fetch(urlDaily);
    if (!resCurrent.ok) {
        errorInformation.innerText = `${resCurrent.statusText}. Try please later`;
    } else {
        const dataCurrent = await resCurrent.json();
        showForecast(dataCurrent);
        showInformationOnpage(localStorage.getItem('language'));
    }
}

export default getWeatherForecast;
