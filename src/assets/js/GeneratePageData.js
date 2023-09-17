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
let wind;
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
    const num = 0.44704
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
            if (wind) {
                wind /= num;
            } else {
                wind = getWeather.windSpeed / num;
            }

            windSpeedBlock.innerHTML = `${translationData.translateDSky.wind[localStorage.getItem('language')]} ${wind.toFixed()} ${translationData.translateDSky.ms[localStorage.getItem('language')]}`;

            localStorage.setItem('units', 'imperial');
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
            if (wind) {
                wind *= num;
            } else {
                wind = getWeather.windSpeed * num;
            }
            windSpeedBlock.innerHTML = `${translationData.translateDSky.wind[localStorage.getItem('language')]} ${wind.toFixed()} ${translationData.translateDSky.msTwo[localStorage.getItem('language')]}`;
            localStorage.setItem('units', 'metric');
        }
    });
}

function showWeatherIcon(weatherCode, elem) {
    console.log(weatherCode, elem)
    switch (weatherCode) {
        case 'freezing_rain_heavy':
        case 'freezing_rain':
        case 'freezing_rain_light':
            elem.src = './assets/images/icons/weather/sleet.svg';
            break;
        case 'Clear':
            elem.src = './assets/images/icons/weather/day.svg';
            break;
        case 'mostly_clear':
        case 'partly_cloudy':
            elem.src = './assets/images/icons/weather/cloudy-day.svg';
            break;
        case 'mostly_cloudy':
        case 'Clouds':
            elem.src = './assets/images/icons/weather/cloudy.svg';
            break;
        case 'Mist':
        case 'Smoke':
        case 'Haze':
        case 'Dust':
        case 'Sand':
        case 'Ash':
        case 'Squall':
        case 'Tornado':
        case 'Fog':
            elem.src = './assets/images/icons/weather/mist.svg';
            break;
        case 'Drizzle':
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
        case 'Thunderstorm':
            elem.src = './assets/images/icons/weather/thunder.svg';
            break;
        case 'rain_light':
            elem.src = './assets/images/icons/weather/rainyli.svg';
            break;
        case 'Rain':
            elem.src = './assets/images/icons/weather/rainh.svg';
            break;
        case 'rain_heavy':
            elem.src = './assets/images/icons/weather/rainh.svg';
            break;
        case 'Snow':
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
    getWeather.weatherIconsArray.forEach((icon, item) => {
        showWeatherIcon(icon, weatherIcons[item]);
    });
    if (localStorage.getItem('units') === 'metric') {
        windSpeedBlock.innerHTML = `${translationData.translateDSky.wind[language]} ${getWeather.windSpeed} ${translationData.translateDSky.msTwo[language]}`;
    } else {
        windSpeedBlock.innerHTML = `${translationData.translateDSky.wind[language]} ${getWeather.windSpeed} ${translationData.translateDSky.ms[language]}`;
    }
    // weatherDescriptionBlock.innerText = translationData.weatherCode[getWeather.descr][language];
    listenMessage = Math.round(getWeather.farenheitTempArray[0]);
    getWeather.farenheitTempArray.forEach((tempValue, item) => {
        showTemperature(tempValue, temperatureBlocks[item], item, language);
    });


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
    getWeather.humidity = resultsCurrent.current.humidity;
    getWeather.windSpeed = resultsCurrent.current.wind_speed.toFixed();

    // getWeather.descr = resultsCurrent.current.weather[0].description;
    // getWeather.weatherIconsArray = [getWeather.descr];
    getWeather.weatherIconsArray = [resultsCurrent.current.weather[0].main, resultsCurrent.daily[1].weather[0].main, resultsCurrent.daily[2].weather[0].main, resultsCurrent.daily[3].weather[0].main,];
    const farenheitTempCurrent = resultsCurrent.current.temp;
    const feelingTemperature = resultsCurrent.current.feels_like;
    const nextDayTemperature = getDayMiddleTemperature(resultsCurrent.daily[1].temp.max, resultsCurrent.daily[1].temp.min);
    const nextDayTwoTemperature = getDayMiddleTemperature(resultsCurrent.daily[2].temp.max, resultsCurrent.daily[2].temp.min);
    const nextDayThreeTemperature = getDayMiddleTemperature(resultsCurrent.daily[3].temp.max, resultsCurrent.daily[3].temp.min);
    getWeather.farenheitTempArray = [farenheitTempCurrent, feelingTemperature, nextDayTemperature, nextDayTwoTemperature, nextDayThreeTemperature];
    return getWeather;
}

changeLanguage();
export { listenMessage };
