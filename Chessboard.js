// Back End //

// this is the default starting position of a game of chess
const defaultBoardLayout = ["bR:a8", "bB:b8", "bN:c8", "bK:d8", "bQ:e8", "bN:f8", "bB:g8", "bR:h8",
                            "bP:a7", "bP:b7", "bP:c7", "bP:d7", "bP:e7", "bP:f7", "bP:g7", "bP:h7",
                            "wP:a2", "wP:b2", "wP:c2", "wP:d2", "wP:e2", "wP:f2", "wP:g2", "wP:h2",
                            "wR:a1", "wB:b1", "wN:c1", "wK:d1", "wQ:e1", "wN:f1", "wB:g1", "wR:h1"]

class Tile {

}

class Piece {
  constructor(pieceCode) {
    this.color = pieceCode.charAt(0);
    this.type = pieceCode.charAt(1);
    // must be different for each piece
    this.isValidMove = (chessCoord) => {
        // TODO make each piece know how to move properly
        // return a boolean stating whether the move was valid or not
        // will need to know about the game state some how to account for taking pieces, friendly pieces blocking, or en passent pawn capture
    }
  }

  getPieceCode() {
    return this.color + this.type;
  }
}

class ChessEngine {
  /**
   * pieceCodes is an array of strings, each of which
   * represent a code for the peice type and location of
   * every piece on the board.
   *
   * pieceCodes allows specifying any starting board position
   * and is a standard chess game by default.
   */
  constructor(pieceCodes = defaultBoardLayout) {
      this.players = ['w', 'b'];
      this.curPlayer = this.players[0];
      this.tiles = [];
      for (let i = 0; i < 8; i++) {
        this.tiles[i] = [];
        for (let j = 0; j < 8; j++)
          this.tiles[i][j] = new Tile();
      }
      for (let pieceCode in pieceCodes) {
        const arrIndecies = this.arrayIndeciesFromChessCoord(pieceCodes[pieceCode].split(":")[1]);
        this.tiles[arrIndecies[0]][arrIndecies[1]].piece = new Piece(pieceCodes[pieceCode].split(":")[0]);
      }
  }

  arrayIndeciesFromChessCoord(chessCoord) {
    const arrayInd = [];
    arrayInd.push(chessCoord.charCodeAt(0) - 97);
    arrayInd.push(parseInt(chessCoord.charAt(1)) - 1);
    return arrayInd;
  }

  chessCoordFromArrayIndecies(arrayInd) {
    return String.fromCharCode(arrayInd[0] + 97) + (arrayInd[1] + 1).toString();
  }

  /*
   * Will interpret the given moveCommand and either advance the game and
   * return true state or reject the moveCommandCommand and return false.
   *
   * ****EXPOSED TO FRONT END****
   */
  interpretCommand() {

  }

  /*
   * Returns the state of the game in the form of an array of pieceLocationCodes.
   *
   * ****EXPOSED TO FRONT END****
   */
  getGameState() {
    const pieceLocationCodes = [];
    for (let i = 0; i < 8; i++)
      for (let j = 0; j < 8; j++)
        if (this.tiles[i][j].piece)
          pieceLocationCodes.push(this.tiles[i][j].piece.getPieceCode() + ":" + this.chessCoordFromArrayIndecies([i, j]));
    return pieceLocationCodes;
  }
}

// Bottom of Back End //

/*
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

// Front end //

/* Reference to backend */
let chessEngine = new ChessEngine();

/* Frontend state variables */
const tiles = document.querySelectorAll(".tile");
const turnLabel = document.querySelector('#turnLabel');
const pieceImages = {
      "wR":"sprites/whiteRook.png",
      "wN":"sprites/whiteKnight.png",
      "wB":"sprites/whiteBishop.png",
      "wK":"sprites/whiteKing.png",
      "wQ":"sprites/whiteQueen.png",
      "wP":"sprites/whitePawn.png",
      "bR":"sprites/blackRook.png",
      "bN":"sprites/blackKnight.png",
      "bB":"sprites/blackBishop.png",
      "bK":"sprites/blackKing.png",
      "bQ":"sprites/blackQueen.png",
      "bP":"sprites/blackPawn.png"
}

// these variables make sure drag Events work properly
let heldPiece = null;
let startLocation = null;

for (const tile of tiles) {
  tile.addEventListener('dragover', dragOver);
  tile.addEventListener('dragenter', dragEnter);
  tile.addEventListener('dragleave', dragLeave);
  tile.addEventListener('drop', dragDrop);
}

// for (const piece of pieces) {
//   piece.addEventListener('dragstart', dragStart);
//   piece.addEventListener('dragend', dragEnd);
// }

document.addEventListener('onload', displayGameState());

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
  // this line would move the piece from its previous location to "this"
  // this.append(heldPiece);
  console.log(generateMoveCommand(startLocation, this));
}

function dragStart() {
  heldPiece = this;
  startLocation = heldPiece.parentElement;
}

function dragEnd() {
  heldPiece = null;
  startLocation = null;
}

/* This function will generate a command to move a piece
 * from the "start" location to the "end" location.
 */
function generateMoveCommand(start, end) {
  return start.id + " " + end.id;
}

/* Call this by passing the number 1 or 2 in order to
 * set the label stating whose turn it is.
 */
function setPlayerTurn(playerNumber) {
  turnLabel.innerText = "It is Player " + playerNumber + "'s turn.";
}

/*
 * This function makes the front end ask the backend what the
 * state of the game is and then displays that game state on
 * the front end.
 */
function displayGameState() {
  const pieceLocationCodes = chessEngine.getGameState();
  for (let pieceLocationCode of pieceLocationCodes) {
    const pieceCode = pieceLocationCode.split(":")[0];
    const locationCode = pieceLocationCode.split(":")[1];
    placePiece(createPiece(pieceCode), locationCode);
  }
}

/*
 * This function clears the front end to show an empty board
 */
function clearDisplay() {
  for (let tile of tiles)
    if (tile.firstChild)
      tile.removeChild(tile.firstChild);
}

/*
 * This function creates a div tag that represents the pieceCode,
 * initializes it for use, then returns it.
 */
function createPiece(pieceCode) {
  const piece = document.createElement("DIV");
  piece.setAttribute('class', 'piece' + " " + pieceCode);
  piece.setAttribute('draggable', 'true');
  const pieceImg = document.createElement("IMG");
  pieceImg.setAttribute('src', pieceImages[pieceCode]);
  piece.append(pieceImg);
  piece.addEventListener('dragstart', dragStart);
  piece.addEventListener('dragend', dragEnd);
  return piece;
}

/*
 * given a tag representing a piece, this function will place that
 * on the tile corresponding to the locationCode
 */
function placePiece(piece, locationCode) {
  document.getElementById(locationCode).append(piece);
}

// Bottom of Front End //
