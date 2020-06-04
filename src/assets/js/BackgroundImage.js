import { errorInformation } from './Constants';

// eslint-disable-next-line import/prefer-default-export
export async function changeBackground(season, dayTime, element) {
    try {
        const IMAGE_API_TOKEN = 'd35b693bbc2465fad89fead4a6ea958ac2741d9791a9ece87994a879cdc68718';
        const url = `https://api.unsplash.com/photos/random?per_page=1&query=nature,${season},${dayTime}&orientation=landscape&client_id=${IMAGE_API_TOKEN}`;
        console.log(url);
        const res = await fetch(url);
        const data = await res.json();
        element.style = `background-image:url(${data.urls.regular}`;
    } catch (err) {
        if (err.name === 'TypeError') {
            errorInformation.innerText = `We have problems: ${err.message}`;
        } else {
            errorInformation.innerText = 'We use dafault image';
            element.style = "background-image : url( './assets/images/img/rome.jpg' )";
        }
    }
}
