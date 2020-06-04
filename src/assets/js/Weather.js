import { errorInformation } from './Constants';

import { showForecast, showInformationOnpage } from './GeneratePageData';

async function getWeatherForecast(lat, lng, unit) {
    // const WEATHER_API = 'tzp81467de8OhNyaCJ1D1OvOgU6NNvw7';
    const WEATHER_API = 'KAxSHX9iM1iNqu9R5FRtdQoR1MDSx0w3';
    const API_GATEWAY = 'https://api.climacell.co/v3/weather/';
    const urlCurrent = `${API_GATEWAY}realtime?lat=${lat}&lon=${lng}&unit_system=${unit}&fields=feels_like%2Ctemp%2Chumidity%2Cwind_speed%2Cweather_code&apikey=${WEATHER_API}`;
    const urlDaily = `${API_GATEWAY}forecast/daily?lat=${lat}&lon=${lng}&unit_system=${unit}&start_time=now&fields=feels_like%2Ctemp%2Cweather_code&apikey=${WEATHER_API}`;
    const resCurrent = await fetch(urlCurrent);
    const resDaily = await fetch(urlDaily);
    if (!resCurrent.ok || !resDaily.ok) {
        errorInformation.innerText = `${resCurrent.statusText}. Try please later`;
    } else {
        const dataCurrent = await resCurrent.json();
        const dataDaily = await resDaily.json();
        showForecast(dataCurrent, dataDaily);
        showInformationOnpage(localStorage.getItem('language'));
    }
}

export default getWeatherForecast;
