var em = ["💐","🌹","🌻","🏵️","🌺","🌴","🌈","🍓","🍒","🍎","🍉","🍊","🥭","🍍","🍋","🍏","🍐","🥝","🍇","🥥","🍅","🌶️","🍄","🧅","🥦","🥑","🍔","🍕","🧁","🎂","🍬","🍩","🍫","🎈"];

var firstCard = null;
var secondCard = null;
var locked = false;
var moves = 0;
var remaining = 0;
var timer = null;
var elapsed = 0;
var mode = "";
var rows = 4;
var cols = 4;

function shuffle(items) {
    var result = items.slice();
    for (var i = result.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = result[i];
        result[i] = result[j];
        result[j] = temp;
    }
    return result;
}

function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainder = seconds % 60;
    return "0" + minutes + ":" + (remainder < 10 ? "0" : "") + remainder;
}

function showInstructions() {
    document.getElementById("ol").innerHTML =
        '<center><div id="inst">' +
        '<h3>Welcome!</h3><div>Instructions for the game</div>' +
        '<ul><li>Make pairs of matching blocks by flipping them.</li>' +
        '<li>Click a block to reveal it.</li>' +
        '<li>Non-matching blocks will flip back.</li></ul>' +
        '<p>Choose a mode to start the game.</p></div>' +
        '<button onclick="start(3, 4)">3 x 4</button>' +
        '<button onclick="start(4, 4)">4 x 4</button>' +
        '<button onclick="start(4, 5)">4 x 5</button>' +
        '<button onclick="start(5, 6)">5 x 6</button>' +
        '<button onclick="start(6, 6)">6 x 6</button></center>';
}

function start(r, l) {
    rows = r;
    cols = l;
    mode = r + " x " + l;
    moves = 0;
    elapsed = 0;
    remaining = r * l / 2;
    firstCard = null;
    secondCard = null;
    locked = false;

    document.getElementById("moves").textContent = "Moves: 0";
    document.getElementById("time").textContent = "Time: 00:00";

    clearInterval(timer);
    timer = setInterval(function () {
        elapsed++;
        document.getElementById("time").textContent = "Time: " + formatTime(elapsed);
    }, 1000);

    var pairCount = r * l / 2;
    var items = em.slice(0, pairCount).concat(em.slice(0, pairCount));
    items = shuffle(items);

    var table = document.querySelector("table");
    table.innerHTML = "";

    var index = 0;
    for (var i = 0; i < r; i++) {
        var row = document.createElement("tr");
        for (var j = 0; j < l; j++) {
            var cell = document.createElement("td");
            cell.innerHTML =
                '<div class="inner">' +
                '<div class="front"></div>' +
                '<div class="back"><p>' + items[index++] + '</p></div>' +
                '</div>';
            cell.addEventListener("click", function () {
                change(this);
            });
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    document.getElementById("ol").style.display = "none";
}

function change(cell) {
    var inner = cell.querySelector(".inner");

    if (locked || cell === firstCard || inner.classList.contains("matched")) {
        return;
    }

    inner.style.transform = "rotateY(180deg)";

    if (!firstCard) {
        firstCard = cell;
        return;
    }

    secondCard = cell;
    locked = true;
    moves++;
    document.getElementById("moves").textContent = "Moves: " + moves;

    var firstSymbol = firstCard.querySelector(".back p").textContent;
    var secondSymbol = secondCard.querySelector(".back p").textContent;

    if (firstSymbol === secondSymbol) {
        firstCard.querySelector(".inner").classList.add("matched");
        secondCard.querySelector(".inner").classList.add("matched");
        remaining--;
        resetTurn();

        if (remaining === 0) {
            clearInterval(timer);
            setTimeout(showComplete, 700);
        }
    } else {
        setTimeout(function () {
            firstCard.querySelector(".inner").style.transform = "rotateY(0deg)";
            secondCard.querySelector(".inner").style.transform = "rotateY(0deg)";
            resetTurn();
        }, 850);
    }
}

function resetTurn() {
    firstCard = null;
    secondCard = null;
    locked = false;
}

function showComplete() {
    var overlay = document.getElementById("ol");
    var resultTime = elapsed < 60
        ? elapsed + " seconds"
        : Math.floor(elapsed / 60) + " minute(s) and " + (elapsed % 60) + " second(s)";

    overlay.innerHTML =
        '<center><div id="iol">' +
        '<h2>Congrats!</h2>' +
        '<p>You completed the ' + mode + ' mode in ' + moves + ' moves.</p>' +
        '<p>It took you ' + resultTime + '.</p>' +
        '<p>Play again?</p>' +
        '<button onclick="start(3, 4)">3 x 4</button>' +
        '<button onclick="start(4, 4)">4 x 4</button>' +
        '<button onclick="start(4, 5)">4 x 5</button>' +
        '<button onclick="start(5, 6)">5 x 6</button>' +
        '<button onclick="start(6, 6)">6 x 6</button>' +
        '</div></center>';
    overlay.style.display = "block";
}

window.onload = showInstructions;
