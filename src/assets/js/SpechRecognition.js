import { searchBtn, microphoneBtn, inputEl, speakerBtn } from './Constants';
import { listenMessage, getWeather } from './GeneratePageData';
import { translationData } from './TranslateData';
// eslint-disable-next-line import/no-cycle
// import { getWeather } from './GeneratePageData';

// eslint-disable-next-line import/prefer-default-export
const msg = new SpeechSynthesisUtterance();

function listenTotheWeather() {
    const curLang = localStorage.getItem('language');
    msg.rate = 1;
    msg.pitch = 1;
    msg.text = `${translationData.translateDSky.sound[curLang]} ${listenMessage} ${translationData.translateDSky.degree[curLang]}. ${
        translationData.weatherCode[getWeather.descr][curLang]
    }. ${translationData.translateDSky.wind[curLang]} ${getWeather.windSpeed} ${translationData.translateDSky.msTwo[curLang]}. ${translationData.translateDSky.humidity[curLang]} ${
        getWeather.humidity
    }%`;
    speechSynthesis.speak(msg);
    // eslint-disable-next-line func-names
    msg.onend = function () {
        speakerBtn.classList.remove('btn-active');
        speakerBtn.disabled = false;
    };
}

// eslint-disable-next-line import/prefer-default-export
function speakVoice() {
    msg.volume = 0.5;
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new window.SpeechRecognition();
    recognition.interimResults = false;
    recognition.maxAlternatives = 2;
    recognition.continuous = false;

    recognition.onresult = (event) => {
        for (let i = event.resultIndex, len = event.results.length; i < len; i += 1) {
            const { transcript } = event.results[i][0];
            if (event.results[i].isFinal) {
                inputEl.value = transcript;
            } else {
                inputEl.value = transcript;
            }
        }

        switch (inputEl.value) {
            case 'weather':
            case 'погода':
                listenTotheWeather();
                break;
            case 'quieter':
            case 'потише':
            case 'цішэй':
                msg.volume -= 0.2;
                break;
            case 'louder':
            case 'громче':
            case 'гучней':
                msg.volume += 0.2;
                break;

            default:
                searchBtn.click();
        }
    };

    recognition.onaudioend = () => {
        microphoneBtn.classList.remove('microphone-active');
    };

    function switchLanguageofSpeech() {
        if (localStorage.getItem('language') === 'en') {
            recognition.lang = 'en-US';
            msg.lang = 'en-UK';
        } else if (localStorage.getItem('language') === 'ru') {
            recognition.lang = 'ru-RU';
            msg.lang = 'ru-RU';
        } else if (localStorage.getItem('language') === 'be') {
            recognition.lang = 'be-BE';
            msg.lang = 'ru-RU';
        }
    }

    const microphoneactivated = () => {
        microphoneBtn.addEventListener('click', () => {
            switchLanguageofSpeech();
            if (microphoneBtn.classList.contains('microphone-active')) {
                microphoneBtn.classList.remove('microphone-active');
                recognition.stop();
            } else {
                microphoneBtn.classList.add('microphone-active');
                recognition.start();
            }
        });
    };

    speakerBtn.addEventListener('click', () => {
        if (!speakerBtn.disabled) {
            speakerBtn.disabled = true;
            speakerBtn.classList.add('btn-active');
            switchLanguageofSpeech();
            listenTotheWeather();
        }
    });

    microphoneactivated();
}

speakVoice();
