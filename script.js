const imgs = document.querySelectorAll('img');
const button = document.querySelector('button');
const gifImg = document.querySelector('.robot img');
const audioElement = document.getElementById('audioElement');

// Blagues API - FRENCH
const tokenBlaguesApi = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTUyMTMyNTgxMDM3NDQxMDI0IiwibGltaXQiOjEwMCwia2V5IjoiUWtITnFDa0hQVHVMZjdQSkE4bTMwbTdVaFNiQ1RPendRelZJY1g2Z0VJV01FaEVuUFkiLCJjcmVhdGVkX2F0IjoiMjAyMy0wOC0xN1QxNjowMjowMiswMDowMCIsImlhdCI6MTY5MjI4ODEyMn0.yD0razdUF9udRp1RMWRScJ48RPUl1aX3Zv5G1YAVhs8';
const blagues = new BlaguesAPI(tokenBlaguesApi);

// VoiceRSS Javascript SDK
const apiKeyVoiceRss = '4d6939b949b3484b9f7af778ba1940fd';

function toggleButton() {
    button.disabled = !button.disabled;
}

async function fetchJoke() {
    try {
        const blague = await blagues.random({
            disallow: [
                blagues.categories.DARK,
                blagues.categories.LIMIT,
                blagues.categories.BEAUF
            ]
        });
        return blague;
    } catch (error) {
        console.log(error);
    }
}
// Test VoiceRSS
function getEstimatedDuration(text) {
    const wordsPerMinute = 130; // valeur moyenne pour la parole
    const numberOfWords = text.split(' ').length;
    return (numberOfWords / wordsPerMinute) * 60 * 1000; // retourne en millisecondes
}

async function launchJoke() {
    const blague = await fetchJoke();

    //  Launch Gif - Desactivate Button
    rub.play();
    toggleButton();

    // Joke
    VoiceRSS.speech({
        key: apiKeyVoiceRss,
        src: blague.joke,
        hl: 'fr-fr',
        v: 'Zola',
        r: 0,
        c: 'wav',
        f: '44khz_16bit_stereo',
        ssml: false
    });

    // Answer
    setTimeout(() => {
        VoiceRSS.speech({
            key: apiKeyVoiceRss,
            src: blague.answer,
            hl: 'fr-fr',
            v: 'Iva',
            r: 0,
            c: 'wav',
            f: '44khz_16bit_stereo',
            ssml: false
        });
    }, getEstimatedDuration(blague.joke) + 1000);  // 1000 millisecondes Pause

    // Stop the Gif and reactive the button
    setTimeout(() => {
        toggleButton();
        rub.pause();
    }, getEstimatedDuration(blague.joke) + 1000 + getEstimatedDuration(blague.answer));
}

// Gif moving treatment
const rub = new SuperGif({ gif: gifImg });
rub.load(function () {
    console.log('GIF loaded.');
});

button.addEventListener('click', launchJoke);