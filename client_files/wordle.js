//#region initializing variables and words
let width = 0; // the number of letters in a guess
let row = 0; //current guess (attempt #)
let column = 0; //current letter for that attempt

let gameIsOver = false;

const guessList = ["arbeznik", "babb", "barker", "barnes", "beach", "becker", "betz", "boenker", "bogen", "bradesca", "bredendiek", "brennan", "burrows", "buzzelli", "caputo", "chaffee", "chronister", "cicetti", "columnborn", "corrigan", "crew", "croglio", "decarlo", "devenney", "donovan", "emancipator", "fior", "fitzpatrick","foster","franzinger","fuchs","galicki","gallagher","gallaway","ganor","graora","gross","guiao","hallal","hamlin","hanna","hawkins","healay","henderson","hennessey","hess","heyka","hjort","hruby","jarc","johnson","kaiser","keefe","kobe","krainz","kyle","laco","lauer","li","lynchhuggins","martin","mayer","mccafferty","mcginness","mclaughlin","mekker","mielcarek","mulholland","mullen","murphy","partin","pasko","pecot","petras","popelka","prokop","ptak","reagan","restifo","rowell","rubino","sabol","samek","savastano","schuler","sebring","sheils","short","tocchi","torres","true","turner","vilinsky","voigt","walcutt","warren","welo","wimbiscus","wolf","yandek","yappel","yarcusko","zebrak"];

const serverAddress = "https://teacherdle.alexament.codes"; // this is to make it easier to switch between addresses

window.onload = function(){
    initialize();
}
//#endregion

function initialize() {

    createTile();

    createKeyboard();
    
    listenForKeypresses();
}

function createTile() {
        // <span id="0-0" class="tile">P</span>
        let tile = document.createElement("span");
        tile.id = row.toString() + "-" + column.toString();
        tile.classList.add("tile");
        tile.innerText = "";
        document.getElementById("letter-row-" + row).appendChild(tile);
}

function createKeyboard() {
    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫" ]
    ]

    for (let i = 0; i < keyboard.length; i++) {
        let currentRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for (let j = 0; j < currentRow.length; j++) {
            let keyTile = document.createElement("div");

            let key = currentRow[j];
            keyTile.innerText = key;

            if (key == "Enter") {
                keyTile.id = "Enter";
            }
            else if (key == "⌫") {
                keyTile.id = "Backspace";
            }
            else if ("A" <= key && key <= "Z") {
                keyTile.id = "Key" + key; // "Key" + "A";
            } 

            keyTile.addEventListener("click", () => {
                e = { "code" : this.id };
                processInput(e);
            });

            if (key == "Enter") {
                keyTile.classList.add("enter-key-tile");
            } else {
                keyTile.classList.add("key-tile");
            }
            keyboardRow.appendChild(keyTile);
        }
        document.body.appendChild(keyboardRow);
    }
}

function listenForKeypresses() {

    document.addEventListener("keyup", (event) => {
        processInput(event); // when a key is pressed process input
    });

    listenForShift();
}

function listenForShift() {
    document.addEventListener("keydown", (event) => {
        if (gameIsOver) return;
        if (event.code == "ShiftLeft" || event.code == "ShiftRight") {
            document.getElementById("board").style.marginLeft = "30vw";
            for (let i = 0; i < 6; i++) {
                document.getElementById("letter-row-" + i).style.justifyContent = "left";
            }
        }
    });
}

function processInput(event) {
    if (gameIsOver) return;

    const pressedKey = event.code;

    // although currentTile is a variable, it still requires parentheses when being called
    const currentTile = () => { return document.getElementById(row.toString() + '-' + column.toString()); };

    // alert(e.code);
    if ("KeyA" <= pressedKey && pressedKey <= "KeyZ") {
            if (!currentTile()) {
                createTile();
            }
            if (currentTile().innerText == "") {
                currentTile().innerText = pressedKey[3];
                column += 1;
            }
            width++;
    }

    else if (pressedKey == "Backspace") {

        if (column > 0) {
            column--;
            
            if (column != 0) {
                currentTile().remove();
            } else {
                currentTile().innerText = "";
            }
        }
        width--;
    }

    else if (pressedKey == "ShiftLeft" || pressedKey == "ShiftRight") { // this will align all the tiles
        document.getElementById("board").style.marginLeft = "0";
        for (let i = 0; i < 6; i++) {
            document.getElementById("letter-row-" + i).style.justifyContent = "center";
        }
    }

    else if (pressedKey == "Enter") {
        update();
    }

    if (!gameIsOver && row == 6) { // if they have taken six guesses but haven't got it right
        gameIsOver = true;
        document.getElementById("answer").innerText = word;
    }
}

function update() {
    // clear the answer element
    document.getElementById("answer").innerText = "";

    //string up the guesses into the word
    const playerGuess = stringTogetherGuess();

    console.log(playerGuess);

    // check if guess is valid ( in the word list )
    if (!guessList.includes(playerGuess)) {
        document.getElementById("answer").innerText = "Not a valid teacher.";
        return;
    }
    
    // send guess to server
    $.get(`${serverAddress}/guess/${playerGuess}`, (data) => {

        console.log(data);

        colorCode(playerGuess.length, data.colorCode);

        row++; //start new row
        column = 0; //start at 0 for new row
        width = 0; //reset word width
        if (!gameIsOver) createTile(); //create new tile on next line
    });
}

function stringTogetherGuess() { // because all the letters are in separate elements, we need to concatenate them all together
    let guess = "";

    for (let i = 0; i < width; i++) {
        let currTile = document.getElementById(row.toString() + '-' + i.toString());
        let letter = currTile.innerText;
        guess += letter;
    }

    return guess.toLowerCase();
}

function colorCode(wordLength, colorCodeData) {
    let numberCorrect = 0;

    const guess = stringTogetherGuess();

    for (let i = 0; i < wordLength; i++) {

        const letterTile = document.getElementById(row.toString() + "-" + i.toString());
        const keyTile = document.getElementById(`Key${guess[i].toUpperCase()}`);

        // if correct, assign correct class
        if ( colorCodeData[i] == "correct") {
            letterTile.classList.add("correct");
            keyTile.classList.add("correct");
            numberCorrect++;
        }
        // if present, assign present class
        else if ( colorCodeData[i] == "present") {
            letterTile.classList.add("present");
            keyTile.classList.add("present");
        }
        else {
            letterTile.classList.add("absent");
            keyTile.classList.add("absent");
        }
    }

    if (numberCorrect == wordLength) {
        console.log("game over");
        gameIsOver = true;
    }
}