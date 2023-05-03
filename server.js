const express = require("express");
const app = express();

const rebootTimestamp = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()} at ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`; // ex) 1/1/2021 12:00:00
console.log("Rebooted on",rebootTimestamp);

// start a node server on port 80
app.listen(80, () => { console.log("Server running on port 80"); });

// logs incoming requests
app.use((req, res, next) => { console.log(req.ip, req.method, req.url); next(); });

// server static files from the client_files folder
app.use("/", express.static("client_files"));

// favicon
app.get("/favicon.ico", (req, res) => { res.sendFile(__dirname + "/favicon.png"); });

// help page
app.get("/help-page", (req, res) => { res.sendFile(__dirname + "/help-page/"); });

// reboot timestamp
app.get("/reboot-timestamp", (req, res) => { res.send(rebootTimestamp); });

//#region handle incoming guesses
app.get("/guess/:playerGuess", (req, res) => {

    console.log(`A player is guessing ${req.params.playerGuess}`);

    data = { colorCode : [] }; // the colorCode property will look something like ["correct", "present", "absent", "present"], with each array item corresponding to the letter in the same position. 

    getWordThenCheckGuess(req.params.playerGuess);

    res.send(data);
});

function getWordThenCheckGuess(playerGuess) {
    const guessList = ["arbeznik", "babb", "barker", "barnes", "beach", "becker", "betz", "boenker", "bogen", "bradesca", "bredendiek", "brennan", "burrows", "buzzelli", "caputo", "chaffee", "chronister", "cicetti", "columnborn", "corrigan", "crew", "croglio", "decarlo", "devenney", "donovan", "emancipator", "fior", "fitzpatrick","foster","franzinger","fuchs","galicki","gallagher","gallaway","ganor","graora","gross","guiao","hallal","hamlin","hanna","hawkins","healay","henderson","hennessey","hess","heyka","hjort","hruby","jarc","johnson","kaiser","keefe","kobe","krainz","kyle","laco","lauer","li","lynchhuggins","martin","mayer","mccafferty","mcginness","mclaughlin","mekker","mielcarek","mulholland","mullen","murphy","partin","pasko","pecot","petras","popelka","prokop","ptak","reagan","restifo","rowell","rubino","sabol","samek","savastano","schuler","sebring","sheils","short","tocchi","torres","true","turner","vilinsky","voigt","walcutt","warren","welo","wimbiscus","wolf","yandek","yappel","yarcusko","zebrak"];

    // if the word doesn't exist or it was generated on a different day than today, this generates a new word
    if (!globalThis.wordOfTheDay || globalThis.date.getDate() != new Date().getDate() || globalThis.date.getMonth() != new Date().getMonth() || globalThis.date.getYear() != new Date().getYear()) {

        globalThis.wordOfTheDay = guessList[Math.floor(Math.random() * guessList.length)];
        globalThis.date = new Date();
    }
    
    checkGuess(globalThis.wordOfTheDay, playerGuess, guessList);
}

function checkGuess(word, playerGuess, guessList) {

    if (!guessList.includes(word)) return;

    console.log(`The teacher of the day is ${word}. The player is guessing ${playerGuess}`);

    //start processing guess
    let correct = 0; // if correct = width, then that indicates the player got it right and game over.

    let letterCount = {}; //keep track of letter frequency, ex) KENNY -> {K:1, E:1, N:2, Y: 1}
    
    for (let i = 0; i < playerGuess.length; i++) {
        let letter = playerGuess[i];

        if (!letterCount[letter]) { // if the server sees a letter for the first time
           letterCount[letter] = 1;
        } 
        else { // if this is not the first time the server sees a letter
           letterCount[letter]++;
        }
    }

    console.log(letterCount);

    for (let i = 0; i < playerGuess.length; i++) {

        // check if letter is in the correct place
        if (word[i] == playerGuess[i]) {
            correct++;
            data.colorCode.push("correct");
            letterCount[playerGuess[i]] -= 1;
        } 
        
        // check if letter is in the word but not in the correct place
        else if (word.includes(playerGuess[i]) && letterCount[playerGuess[i]] > 0) {
            data.colorCode.push("present");
            letterCount[playerGuess[i]] -= 1;
        } 
        
        // else letter is not in word
        else {
            data.colorCode.push("absent");
        }
    }
}
//#endregion