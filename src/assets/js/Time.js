import { nextDayNames, locationTime, locationCity } from './Constants';
import { translationData } from './TranslateData';
// import { locationCity } from './Location';

export async function getSeason(date, hours, locationLatitude) {
    const worldSide = locationLatitude[locationLatitude.length - 1];
    if (date.getMonth() < 2 || date.getMonth() > 10) {
        locationTime.yearTime = worldSide === 'N' ? 'winter' : 'summer';
    }
    if (date.getMonth() < 5 && date.getMonth() > 1) {
        locationTime.yearTime = worldSide === 'N' ? 'spring' : 'autumn';
    }
    if (date.getMonth() < 8 && date.getMonth() > 4) {
        locationTime.yearTime = worldSide === 'N' ? 'summer' : 'winter';
    }
    if (date.getMonth() < 11 && date.getMonth() > 7) {
        locationTime.yearTime = worldSide === 'N' ? 'autumn' : 'spring';
    }
    if (hours <= 5 || hours >= 23 || hours === 0) {
        locationTime.dayTime = 'night';
    }
    if (hours >= 5 && hours < 10) {
        locationTime.dayTime = 'morning';
    }
    if (hours >= 10 && hours < 19) {
        locationTime.dayTime = 'day';
    }
    if (hours >= 19 && hours < 23) {
        locationTime.dayTime = 'evening';
    }
}

function getCityZoneTime(offset) {
    const date = new Date();
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const nd = new Date(utc + 3600000 * offset);
    return nd;
}

export async function nextDay(offset, language) {
    const nd = getCityZoneTime(offset);
    locationTime.daynext = nd.getDay();
    const hour = nd.getHours();

    nextDayNames.forEach((dayBlock) => {
        locationTime.daynext += 1;
        dayBlock.innerText = `${translationData.days[locationTime.daynext][language]}`;
    });
    await getSeason(nd, hour, locationCity.latitude);
}

export function calcTime(offset, elem, language) {
    const nd = getCityZoneTime(offset);
    const hour = nd.getHours();
    const minute = nd.getMinutes();
    const sec = nd.getSeconds();
    const day = nd.getDate();
    const month = nd.getMonth();
    const weekday = nd.getDay();
    elem.innerText = `${translationData.shortDays[weekday][language]}, ${day} ${translationData.month[month + 1][language]},  ${hour < 10 ? '0' : ''}${hour}:${
        minute < 10 ? '0' : ''
    }${minute}:${sec < 10 ? '0' : ''}${sec}`;
}
