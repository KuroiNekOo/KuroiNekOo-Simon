const app = {
  // just a utility var to remember all the colors
  colors: ["red", "green", "blue", "yellow"],

  // this var will contain the sequence said by Simon
  sequence: [],

  // player position in Simon's sequence
  indice: 0,

  // stock the setTimeout of the game timer
  timeoutTimer: undefined,

  // cell generation in the DOM
  drawCells() {
    const playground = document.querySelector("#playground");
    for (const color of app.colors) {
      let cell = document.createElement("div");
      cell.className = "cell";
      cell.id = color;
      cell.style.backgroundColor = color;
      playground.appendChild(cell);
    }
  },

  // event-click cell animation
  bumpCell(color) {
    // let's modify the style directly
    document.querySelector(`#${color}`).style.borderWidth = "45px";
    // and reset the same style, after a small pause (150 ms)
    setTimeout(() => {
      document.querySelector(`#${color}`).style.borderWidth = "0";
    }, 150);
  },

  // starting a new game
  newGame() {
    app.removeSecurity();
    // start by reseting the sequence and position
    app.sequence = [];
    app.indice = 0;
    // make it 3 times :
    for (let index = 0; index < 3; index++) {
      // get a random number between 0 and 3
      let random = Math.floor(Math.random() * 4);
      // add the corresponding color to the sequence
      app.sequence.push(app.colors[random]);
    }

    // start the "Simon Says" sequence
    app.simonSays(app.sequence);
  },

  // activates click safety on cells
  displaySecurity() {
    const elemSecurity = document.querySelector(".security");
    elemSecurity.classList.add("visible");
  },

  // disables click security on cells
  removeSecurity() {
    const elemSecurity = document.querySelector(".security");
    elemSecurity.classList.remove("visible");
  },

  // sequence display on screen
  simonSays(sequence) {
    app.showMessage("Mémorisez la séquence");
    if (sequence && sequence.length) {
      app.displaySecurity();
      // after 500ms, bump the first cell
      setTimeout(app.bumpCell, 500, sequence[0]);
      // plays the rest of the sequence after a longer pause
      setTimeout(app.simonSays, 850, sequence.slice(1));
    } else {
      app.removeSecurity();
      app.showMessage("Reproduisez la séquence");
      app.timeoutTimer = setTimeout(app.endGame, 5000);
    }
  },

  // send a message to replace the "start" button
  showMessage(message) {
    const btnPlay = document.querySelector("#go");
    btnPlay.style.display = "none";
    document.querySelector("#message").innerHTML = message;
  },

  // display of the "start" button instead of the message
  displayBtnPlay() {
    const btnPlay = document.querySelector("#go");
    btnPlay.style.display = null;
    document.querySelector("#message").innerHTML = null;
  },

  // end of game and message display
  endGame() {
    app.displaySecurity();
    const messageEndGame = `Partie terminée. Votre score : ${app.sequence.length}`;
    app.showMessage(messageEndGame);
    setTimeout(app.displayBtnPlay, 5000);
  },

  // event-click listeners on cells and algo when a cell is clicked
  playerRepeat() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", (e) => {
        const color = e.target.id;
        app.bumpCell(color);
        clearTimeout(app.timeoutTimer);
        if (color === app.sequence[app.indice]) {
          app.indice++;
          app.timeoutTimer = setTimeout(app.endGame, 5000);
          if (app.indice === app.sequence.length) {
            clearTimeout(app.timeoutTimer);
            app.nextMove();
          }
        } else {
          app.endGame();
        }
      });
    });
  },

  // generate the next color in Simon's sequence
  nextMove() {
    const random = Math.floor(Math.random() * 4);
    app.sequence.push(app.colors[random]);
    app.simonSays(app.sequence);
    app.indice = 0;
  },

  // Initialization: cell generation / event click listeners / security
  init() {
    // génération des cellules dans le DOM
    app.drawCells();

    // initialisation des écouteurs d'event des cellules
    app.playerRepeat();

    // sécurité active pour ne pas cliquer sur les cellules
    app.displaySecurity();

    // listen click on the "go" button
    document.querySelector("#go").addEventListener("click", app.newGame);
  },
};

document.addEventListener("DOMContentLoaded", app.init);
