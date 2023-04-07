//#region initializing variables and words
let height = 6; //number of guesses
let width = 0;

let row = 0; //current guess (attempt #)
let col = 0; //current letter for that attempt

let gameOver = false;

const guessList = ["arbeznik", "babb", "barker", "barnes", "beach", "becker", "betz", "boenker", "bogen", "bradesca", "bredendiek", "brennan", "burrows", "buzzelli", "caputo", "chaffee", "chronister", "cicetti", "colborn", "corrigan", "crew", "croglio", "decarlo", "devenney", "donovan", "emancipator", "fior", "fitzpatrick","foster","franzinger","fuchs","galicki","gallagher","gallaway","ganor","graora","gross","guiao","hallal","hamlin","hanna","hawkins","healay","henderson","hennessey","hess","heyka","hjort","hruby","jarc","johnson","kaiser","keefe","kobe","krainz","kyle","laco","lauer","li","martin","mayer","mccafferty","mcginness","mclaughlin","mekker","mielcarek","mulholland","mullen","murphy","partin","pasko","pecot","petras","popelka","prokop","ptak","reagan","restifo","rowell","rubino","sabol","samek","savastano","schuler","sebring","sheils","short","tocchi","torres","true","turner","vilinsky","voigt","walcutt","warren","welo","wimbiscus","wolf","yandek","yappel","yarcusko","zebrak"];

const word = guessList[Math.floor(Math.random()*guessList.length)].toUpperCase();
console.log(word);

window.onload = function(){
    intialize();
}
//#endregion

function intialize() {

    //#region Create tile element: <span id="0-0" class="tile">P</span>
    let tile = document.createElement("span");
    tile.id = "0-0";
    tile.classList.add("tile");
    tile.innerText = "";
    document.getElementById("letter-row-0").appendChild(tile);
    //#endregion

    //#region Create the key board
    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫" ]
    ]

    for (let i = 0; i < keyboard.length; i++) {
        let currRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for (let j = 0; j < currRow.length; j++) {
            let keyTile = document.createElement("div");

            let key = currRow[j];
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

            keyTile.addEventListener("click", processKey);

            if (key == "Enter") {
                keyTile.classList.add("enter-key-tile");
            } else {
                keyTile.classList.add("key-tile");
            }
            keyboardRow.appendChild(keyTile);
        }
        document.body.appendChild(keyboardRow);
    }
    //#endregion

    //listen specifically for shift button
    document.addEventListener("keydown", (event) => {
        if (gameOver) return;
        if (event.code == "ShiftLeft" || event.code == "ShiftRight") {
            document.getElementById("board").style.marginLeft = "30vw";
            for (let i = 0; i < 6; i++) {
                document.getElementById("letter-row-" + i).style.justifyContent = "left";
            }
        }
    });
    
    // Listen for Key Press
    document.addEventListener("keyup", (e) => {
        processInput(e);
    })
}

function processKey() {
    e = { "code" : this.id };
    processInput(e);
}

function createTile() {
        // <span id="0-0" class="tile">P</span>
        let tile = document.createElement("span");
        tile.id = row.toString() + "-" + col.toString();
        tile.classList.add("tile");
        tile.innerText = "";
        document.getElementById("letter-row-" + row).appendChild(tile);
}

function processInput(e) {
    if (gameOver) return; 

    // alert(e.code);
    if ("KeyA" <= e.code && e.code <= "KeyZ") {
            let currTile = document.getElementById(row.toString() + '-' + col.toString());
            if (!currTile) {
                createTile();
                currTile = document.getElementById(row.toString() + '-' + col.toString());
            }
            if (currTile.innerText == "") {
                currTile.innerText = e.code[3];
                col += 1;
            }
            width++;
    }

    else if (e.code == "Backspace") {
        currTile = document.getElementById(row.toString() + '-' + col.toString());

        if (col > 0) {
            col--;
            currTile = document.getElementById(row.toString() + '-' + col.toString());
            
            if (col != 0) {
                currTile.remove();
            } else {
                currTile.innerText = "";
            }
        }
        width--;
    }

    else if (e.code == "ShiftLeft" || e.code == "ShiftRight") {
        document.getElementById("board").style.marginLeft = "0";
        for (let i = 0; i < 6; i++) {
            document.getElementById("letter-row-" + i).style.justifyContent = "center";
        }
    }

    else if (e.code == "Enter") {
        update();
    }

    if (!gameOver && row == height) {
        gameOver = true;
        document.getElementById("answer").innerText = word;
    }
}

function update() {
    let guess = "";
    document.getElementById("answer").innerText = "";

    //string up the guesses into the word
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;
        guess += letter;
    }

    guess = guess.toLowerCase(); //case sensitive
    console.log(guess);

    if (!guessList.includes(guess)) {
        document.getElementById("answer").innerText = "Not a valid teacher.";
        return;
    }
    
    //start processing guess
    let correct = 0;

    let letterCount = {}; //keep track of letter frequency, ex) KENNY -> {K:1, E:1, N:2, Y: 1}
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];

        if (letterCount[letter]) {
           letterCount[letter] += 1;
        } 
        else {
           letterCount[letter] = 1;
        }
    }

    console.log(letterCount);

    //first iteration, check all the correct ones first
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        //Is it in the correct position?
        if (word[c] == letter) {
            currTile.classList.add("correct");

            let keyTile = document.getElementById("Key" + letter);
            keyTile.classList.remove("present");
            keyTile.classList.add("correct");

            correct += 1;
            letterCount[letter] -= 1; //deduct the letter count
        }

        if (correct == width) {
            gameOver = true;
        }
    }

    console.log(letterCount);
    //go again and mark which ones are present but in wrong position
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        // skip the letter if it has been marked correct
        if (!currTile.classList.contains("correct")) {
            //Is it in the word?         //make sure we don't double count
            if (word.includes(letter) && letterCount[letter] > 0) {
                currTile.classList.add("present");
                
                let keyTile = document.getElementById("Key" + letter);
                if (!keyTile.classList.contains("correct")) {
                    keyTile.classList.add("present");
                }
                letterCount[letter] -= 1;
            } // Not in the word or (was in word but letters all used up to avoid overcount)
            else {
                currTile.classList.add("absent");
                let keyTile = document.getElementById("Key" + letter);
                keyTile.classList.add("absent")
            }
        }
    }

    row++; //start new row
    col = 0; //start at 0 for new row
    width = 0; //resets word width
    if (!gameOver) createTile(); //create new tile on next line
}