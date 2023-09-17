import { askBtn, locationTime, clearBtn, celsiumButton, farenheitButton, searchBtn, inputEl, refreshBtn, bodyBlock, spinner, errorInformation } from './Constants';
import { getLocation } from './Location';
import { changeBackground } from './BackgroundImage';
// import { showInformationOnpage } from './GeneratePageData';

if (!localStorage.language) localStorage.language = 'en';
if (!localStorage.indexSelected) localStorage.indexSelected = 0;
if (!localStorage.units) localStorage.units = 'metric';
if (localStorage.getItem('units') === 'metric') {
    celsiumButton.classList.add('temp-active');
} else {
    farenheitButton.classList.add('temp-active');
}

export const lang = localStorage.getItem('language');
export const units = localStorage.getItem('units');

const spinnerVision = () => {
    spinner.classList.toggle('block-visible');
};

async function search() {
    errorInformation.innerText = '';
    try {
        spinnerVision();
        const searchCity = inputEl.value;
        await getLocation(searchCity);
        spinnerVision();
    } catch (error) {
        errorInformation.innerText = `We have problems: ${error.message}`;
        spinnerVision();
    }
}

const buttonsFuctionality = () => {
    searchBtn.addEventListener('click', (event) => {
        event.preventDefault();
        search(localStorage.getItem('language'));
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Enter') {
            event.preventDefault();
            searchBtn.click();
        }
    });

    askBtn.addEventListener('click', () => {
        // eslint-disable-next-line no-alert
        alert(
            'Погода по словам в зависимости от языка: прогноз по словам "weather" или "погода"; звук тише - "quieter", "потише", "тихіше"; громче - "louder", "громче", "голосніше". Доп.функционал: лоадер, Мой телеграм @romatotti2102'
        );
    });

    clearBtn.addEventListener('click', () => {
        inputEl.value = '';
    });

    refreshBtn.addEventListener('click', () => {
        changeBackground(locationTime.yearTime, locationTime.dayTime, bodyBlock);
    });
};

async function init() {
    buttonsFuctionality();
    spinnerVision();
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude } = position.coords;
            const { longitude } = position.coords;
            await getLocation(`${latitude}+${longitude}`);
            spinnerVision();
        },
        async (err) => {
            console.warn(`You decline geolocation. Default value will be used. ${err.code} ${err.message}`);
            await getLocation('Rome');
            spinnerVision();
        }
    );
}

init();
