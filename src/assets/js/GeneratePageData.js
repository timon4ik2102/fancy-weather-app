import { translationData } from './TranslateData';
// import { showInformationOnpage } from './GeneratePageData';

import {
    weatherIcons,
    latitude,
    longitude,
    humidityBlock,
    windSpeedBlock,
    currentDateBlock,
    temperatureBlocks,
    celsiumButton,
    farenheitButton,
    searchBtn,
    errorInformation,
    inputEl,
    weatherDescriptionBlock,
    locationCity,
} from './Constants';
// import translateCityName from './TranslateCity';
import getUserLocationName from './TranslateCity';

import { calcTime, nextDay } from './Time';

export const getWeather = {};
const milesToMeterDividerNum = 2.2369362920544;

const numOne = 1;

function getDayMiddleTemperature(maxtemp, minTemp) {
    return Math.round((maxtemp + minTemp) / 2);
}

// eslint-disable-next-line import/no-mutable-exports
let listenMessage = '';

const select = document.querySelector('.droplist-base');
let intervalTime;
if (localStorage.getItem('indexSelected')) {
    select.options[localStorage.getItem('indexSelected')].selected = true;
}

export function showTemperature(temperature, tempElem, number, language) {
    temperature = Math.round(temperature);

    if (number !== numOne) tempElem.innerHTML = `${temperature}&#176`;
    else tempElem.innerHTML = `${translationData.translateDSky.feels[language]} ${temperature}&#176`;
}

function changeTemperature() {
    farenheitButton.addEventListener('click', () => {
        if (!farenheitButton.classList.contains('temp-active')) {
            celsiumButton.classList.remove('temp-active');
            farenheitButton.classList.add('temp-active');
            getWeather.farenheitTempArray.forEach((tempValue, item) => {
                tempValue = Math.round(tempValue * (9 / 5) + 32);
                if (item === 0) listenMessage = tempValue;
                showTemperature(tempValue, temperatureBlocks[item], item, localStorage.getItem('language'));
                getWeather.farenheitTempArray.splice(item, 1, tempValue);
            });

            localStorage.setItem('units', 'us');
        }
    });
    celsiumButton.addEventListener('click', () => {
        if (!celsiumButton.classList.contains('temp-active')) {
            farenheitButton.classList.remove('temp-active');
            celsiumButton.classList.add('temp-active');
            getWeather.farenheitTempArray.forEach((tempValue, item) => {
                tempValue = Math.round((tempValue - 32) * (5 / 9));
                if (item === 0) listenMessage = tempValue;
                showTemperature(tempValue, temperatureBlocks[item], item, localStorage.getItem('language'));
                getWeather.farenheitTempArray.splice(item, 1, tempValue);
            });
            localStorage.setItem('units', 'si');
        }
    });
}

function showWeatherIcon(weatherCode, elem) {
    switch (weatherCode) {
        case 'freezing_rain_heavy':
        case 'freezing_rain':
        case 'freezing_rain_light':
            elem.src = './assets/images/icons/weather/sleet.svg';
            break;
        case 'clear':
            elem.src = './assets/images/icons/weather/day.svg';
            break;
        case 'mostly_clear':
        case 'partly_cloudy':
            elem.src = './assets/images/icons/weather/cloudy-day.svg';
            break;
        case 'mostly_cloudy':
        case 'cloudy':
            elem.src = './assets/images/icons/weather/cloudy.svg';
            break;
        case 'fog_light':
        case 'fog':
            elem.src = './assets/images/icons/weather/mist.svg';
            break;
        case 'drizzle':
            elem.src = './assets/images/icons/weather/drizzly.svg';
            break;
        case 'freezing_drizzle':
            elem.src = './assets/images/icons/weather/drizzly-fr.svg';
            break;
        case 'ice_pellets_heavy':
        case 'ice_pellets':
            elem.src = './assets/images/icons/weather/ice-pel.svg';
            break;
        case 'ice_pellets_light':
            elem.src = './assets/images/icons/weather/ice-pel-light.svg';
            break;
        case 'flurries':
            elem.src = './assets/images/icons/weather/wind.svg';
            break;
        case 'tstorm':
            elem.src = './assets/images/icons/weather/thunder.svg';
            break;
        case 'rain_light':
            elem.src = './assets/images/icons/weather/rainyli.svg';
            break;
        case 'rain':
            elem.src = './assets/images/icons/weather/rain.svg';
            break;
        case 'rain_heavy':
            elem.src = './assets/images/icons/weather/rainh.svg';
            break;
        case 'snow_heavy':
            elem.src = './assets/images/icons/weather/snow.svg';
            break;
        case 'snow':
            elem.src = './assets/images/icons/weather/snowy.svg';
            break;
        case 'snow_light':
            elem.src = './assets/images/icons/weather/snowyli.svg';
            break;
        default:
            break;
    }
}

export async function showInformationOnpage(language) {
    clearInterval(intervalTime);
    intervalTime = setInterval(() => calcTime(locationCity.offset, currentDateBlock, language), 1000);
    latitude.innerText = `${translationData.translate.latitude[language]}: ${locationCity.latitude}`;
    longitude.innerText = `${translationData.translate.longitude[language]}: ${locationCity.longitude}`;
    windSpeedBlock.innerHTML = `${translationData.translateDSky.wind[language]} ${getWeather.windSpeed} ${translationData.translateDSky.ms[language]}`;
    humidityBlock.innerText = `${translationData.translateDSky.humidity[language]} ${getWeather.humidity}%`;
    searchBtn.innerText = `${translationData.translate.search[language]}`;
    inputEl.placeholder = `${translationData.translate.placeholder[language]}`;
    nextDay(locationCity.offset, language);
    getWeather.farenheitTempArray.forEach((tempValue, item) => {
        showTemperature(tempValue, temperatureBlocks[item], item, language);
    });
    getWeather.weatherIconsArray.forEach((icon, item) => {
        showWeatherIcon(icon, weatherIcons[item]);
    });
    weatherDescriptionBlock.innerText = translationData.weatherCode[getWeather.descr][language];
    listenMessage = Math.round(getWeather.farenheitTempArray[0]);
    changeTemperature();
}

export function changeLanguage() {
    // eslint-disable-next-line func-names
    select.addEventListener('change', function () {
        errorInformation.innerText = '';
        const { value } = this;
        getUserLocationName(locationCity.city, value);
        // translateCityName(locationCity.header, value);
        showInformationOnpage(value);
        localStorage.setItem('language', value);
        localStorage.setItem('indexSelected', this.selectedIndex);
    });
}

export function showForecast(resultsCurrent, resultsDaily) {
    getWeather.humidity = resultsCurrent.humidity.value;
    const windSpeed = resultsCurrent.wind_speed.value;
    if (localStorage.getItem('units') !== 'si') {
        getWeather.windSpeed = (windSpeed / milesToMeterDividerNum).toFixed();
    } else {
        getWeather.windSpeed = windSpeed.toFixed();
    }
    getWeather.descr = resultsCurrent.weather_code.value;
    getWeather.weatherIconsArray = [getWeather.descr, resultsDaily[1].weather_code.value, resultsDaily[2].weather_code.value, resultsDaily[3].weather_code.value];
    const farenheitTempCurrent = resultsCurrent.temp.value;
    const feelingTemperature = resultsCurrent.feels_like.value;
    const nextDayTemperature = getDayMiddleTemperature(resultsDaily[1].temp[1].max.value, resultsDaily[1].temp[0].min.value);
    const nextDayTwoTemperature = getDayMiddleTemperature(resultsDaily[2].temp[1].max.value, resultsDaily[2].temp[0].min.value);
    const nextDayThreeTemperature = getDayMiddleTemperature(resultsDaily[3].temp[1].max.value, resultsDaily[3].temp[0].min.value);
    getWeather.farenheitTempArray = [farenheitTempCurrent, feelingTemperature, nextDayTemperature, nextDayTwoTemperature, nextDayThreeTemperature];
    return getWeather;
}

changeLanguage();
export { listenMessage };
