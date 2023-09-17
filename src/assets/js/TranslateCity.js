// import { cityHeaderBlock, errorInformation } from './Constants';
import { locationCity, cityHeaderBlock } from './Constants';

// async function translateCityName(word, langTo) {
//     try {
//         const translateApiKey = 'trnsl.1.1.20200504T181033Z.9c7a64b1827c9c26.317b1a99e6745276606d457480904d21eea633f3';
//         const urlTranslate = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${translateApiKey}&text=${word}&lang=en-${langTo}`;
//         const res = await fetch(urlTranslate);
//         const data = await res.json();
//         cityHeaderBlock.innerHTML = data.text.join();
//     } catch (err) {
//         cityHeaderBlock.innerHTML = word;
//         errorInformation.innerText = `Names of city support only english. Yandexapi error: ${err.message}`;
//     }
// }

// export default translateCityName;

async function getUserLocationName(searchItem, currLang) {
    const API_SEARCHCITY_KEY = 'bbc5fdee02e141f393493b46af55cd37';
    // const lang = localStorage.getItem('language');
    const opendataUrl = `https://api.opencagedata.com/geocode/v1/json?q=${searchItem}&key=${API_SEARCHCITY_KEY}&language=${currLang}&pretty=1&no_annotations=1`;
    const res = await fetch(opendataUrl);
    const data = await res.json();
    const { lat, lng } = data.results[0].geometry;
    const { city, town, village, country } = data.results[0].components;
    const cityRegionName = data.results[0].formatted.split(',');
    const cityFormattedName = cityRegionName[0].toString().replace(/[0-9]/g, '');
    let searchCity;
    if (city !== undefined) {
        searchCity = city;
    } else if (town !== undefined) {
        searchCity = town;
    } else if (village !== undefined) {
        searchCity = village;
    } else {
        searchCity = cityFormattedName;
    }

    locationCity.city = searchCity;
    locationCity.country = country;
    console.log(country);
    console.log(searchCity);
    locationCity.lat = lat;
    locationCity.lng = lng;
    cityHeaderBlock.innerHTML = `${locationCity.city}, ${locationCity.country}`;
}

export default getUserLocationName;
