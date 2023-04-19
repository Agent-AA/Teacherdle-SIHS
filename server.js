const express = require("express");
const app = express();

// start a node server on port 80
app.listen(80, () => { console.log("Server running on port 80"); });

// logs incoming requests
app.use((req, res, next) => { console.log(req.ip, req.url); next(); });

// server static files from the client_files folder
app.use("/", express.static("client_files"));

// handle incoming guesses
app.get("/guess/:playerGuess", (req, res) => {

    data = { colorCode : [] }; // the colorCode property will look something like ["correct", "present", "absent", "present"], with each array item corresponding to the letter in the same position.

    const playerGuess = req.params.playerGuess;
    console.log(`A player is guessing ${playerGuess}`);
    
    getWordAndCheckGuess(playerGuess);

    res.send(data);
});

function getWordAndCheckGuess(playerGuess) {
    const guessList = ["arbeznik", "babb", "barker", "barnes", "beach", "becker", "betz", "boenker", "bogen", "bradesca", "bredendiek", "brennan", "burrows", "buzzelli", "caputo", "chaffee", "chronister", "cicetti", "columnborn", "corrigan", "crew", "croglio", "decarlo", "devenney", "donovan", "emancipator", "fior", "fitzpatrick","foster","franzinger","fuchs","galicki","gallagher","gallaway","ganor","graora","gross","guiao","hallal","hamlin","hanna","hawkins","healay","henderson","hennessey","hess","heyka","hjort","hruby","jarc","johnson","kaiser","keefe","kobe","krainz","kyle","laco","lauer","li","lynchhuggins","martin","mayer","mccafferty","mcginness","mclaughlin","mekker","mielcarek","mulholland","mullen","murphy","partin","pasko","pecot","petras","popelka","prokop","ptak","reagan","restifo","rowell","rubino","sabol","samek","savastano","schuler","sebring","sheils","short","tocchi","torres","true","turner","vilinsky","voigt","walcutt","warren","welo","wimbiscus","wolf","yandek","yappel","yarcusko","zebrak"];
    const wordOfTheDay = globalThis.word; // this must be stored in a global variable so that it persists between requests
    
    // if the word doesn't exist or it was generated on a different day than today, this generates a new word
    if (!wordOfTheDay || wordOfTheDay.date.getDate() != new Date().getDate() || wordOfTheDay.date.getMonth() != new Date().getMonth() || wordOfTheDay.date.getYear() != new Date().getYear()) {
        globalThis.word = { // we can't use wordOfTheDay here because that would modify the wordOfTheDay variable, not globalThis.word
            word: guessList[Math.floor(Math.random() * guessList.length)],
            date: new Date()
        };
    }
    console.log(globalThis.word.word);
    checkGuess(globalThis.word.word, playerGuess);
}

function checkGuess(word, playerGuess) {
    console.log(word);
    //start processing guess
    let correct = 0; // if correct = width, then that indicates the player got it right and game over.

    let letterCount = {}; //keep track of letter frequency, ex) KENNY -> {K:1, E:1, N:2, Y: 1}
    for (let i = 0; i <playerGuess.length; i++) {
        let letter = playerGuess[i];

        if (letterCount[letter]) {
           letterCount[letter] += 1;
        } 
        else {
           letterCount[letter] = 1;
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