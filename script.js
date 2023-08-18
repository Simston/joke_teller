const imgs = document.querySelectorAll('img');
const button = document.querySelector('button');
const gifImg = document.querySelector('.robot img');
const audioElement = document.getElementById('audioElement');

// Blagues API - FRENCH
const tokenBlaguesApi = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTUyMTMyNTgxMDM3NDQxMDI0IiwibGltaXQiOjEwMCwia2V5IjoiUWtITnFDa0hQVHVMZjdQSkE4bTMwbTdVaFNiQ1RPendRelZJY1g2Z0VJV01FaEVuUFkiLCJjcmVhdGVkX2F0IjoiMjAyMy0wOC0xN1QxNjowMjowMiswMDowMCIsImlhdCI6MTY5MjI4ODEyMn0.yD0razdUF9udRp1RMWRScJ48RPUl1aX3Zv5G1YAVhs8';
const blagues = new BlaguesAPI(tokenBlaguesApi);

// VoiceRSS Javascript SDK
const VoiceRSS = { speech: function (e) { this._validate(e), this._request(e) }, _validate: function (e) { if (!e) throw "The settings are undefined"; if (!e.key) throw "The API key is undefined"; if (!e.src) throw "The text is undefined"; if (!e.hl) throw "The language is undefined"; if (e.c && "auto" != e.c.toLowerCase()) { var a = !1; switch (e.c.toLowerCase()) { case "mp3": a = (new Audio).canPlayType("audio/mpeg").replace("no", ""); break; case "wav": a = (new Audio).canPlayType("audio/wav").replace("no", ""); break; case "aac": a = (new Audio).canPlayType("audio/aac").replace("no", ""); break; case "ogg": a = (new Audio).canPlayType("audio/ogg").replace("no", ""); break; case "caf": a = (new Audio).canPlayType("audio/x-caf").replace("no", "") }if (!a) throw "The browser does not support the audio codec " + e.c } }, _request: function (e) { var a = this._buildRequest(e), t = this._getXHR(); t.onreadystatechange = function () { if (4 == t.readyState && 200 == t.status) { if (0 == t.responseText.indexOf("ERROR")) throw t.responseText; audioElement.src = t.responseText, audioElement.play() } }, t.open("POST", "https://api.voicerss.org/", !0), t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"), t.send(a) }, _buildRequest: function (e) { var a = e.c && "auto" != e.c.toLowerCase() ? e.c : this._detectCodec(); return "key=" + (e.key || "") + "&src=" + (e.src || "") + "&hl=" + (e.hl || "") + "&r=" + (e.r || "") + "&c=" + (a || "") + "&f=" + (e.f || "") + "&ssml=" + (e.ssml || "") + "&b64=true" }, _detectCodec: function () { var e = new Audio; return e.canPlayType("audio/mpeg").replace("no", "") ? "mp3" : e.canPlayType("audio/wav").replace("no", "") ? "wav" : e.canPlayType("audio/aac").replace("no", "") ? "aac" : e.canPlayType("audio/ogg").replace("no", "") ? "ogg" : e.canPlayType("audio/x-caf").replace("no", "") ? "caf" : "" }, _getXHR: function () { try { return new XMLHttpRequest } catch (e) { } try { return new ActiveXObject("Msxml3.XMLHTTP") } catch (e) { } try { return new ActiveXObject("Msxml2.XMLHTTP.6.0") } catch (e) { } try { return new ActiveXObject("Msxml2.XMLHTTP.3.0") } catch (e) { } try { return new ActiveXObject("Msxml2.XMLHTTP") } catch (e) { } try { return new ActiveXObject("Microsoft.XMLHTTP") } catch (e) { } throw "The browser does not support HTTP request" } };
const apiKeyVoiceRss = '4d6939b949b3484b9f7af778ba1940fd';

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
    button.setAttribute('disabled', 'true');

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
        button.disabled = false;
        rub.pause();
    }, getEstimatedDuration(blague.joke) + 1000 + getEstimatedDuration(blague.answer) + 1000);
}

// Gif moving treatment
const rub = new SuperGif({ gif: gifImg });
rub.load(function () {
    console.log('GIF loaded.');
});

button.addEventListener('click', launchJoke);