// Back End //

// this is the default starting position of a game of chess
const defaultBoardLayout = ["bR:a8", "bB:b8", "bN:c8", "bQ:d8", "bK:e8", "bN:f8", "bB:g8", "bR:h8",
                            "bP:a7", "bP:b7", "bP:c7", "bP:d7", "bP:e7", "bP:f7", "bP:g7", "bP:h7",
                            "wP:a2", "wP:b2", "wP:c2", "wP:d2", "wP:e2", "wP:f2", "wP:g2", "wP:h2",
                            "wR:a1", "wB:b1", "wN:c1", "wQ:d1", "wK:e1", "wN:f1", "wB:g1", "wR:h1"]

class Piece {
  constructor(pieceLocationCode, board) {
    this.color = pieceLocationCode.split(":")[0].charAt(0);
    this.type = pieceLocationCode.split(":")[0].charAt(1);
    this.location = pieceLocationCode.split(":")[1];
    this.timesMoved = 0;
    this.board = board;
  }

  /*
   * This function is the main interface with the outside. Calling this function will require the
   * piece to check if the move is valid before completing the move.
   */
  performLegalMove(locationCode) {
    if (this.canMoveTo(locationCode)) {
      if (!this.isOccupied(locationCode)) {
        this.moveTo(locationCode);
        return true;
      } else {
        this.captureAt(locationCode);
        return true;
      }
    } else {
      return false;
    }
  }

  /*
   * This function returns a boolean representing whether the king can make
   * a move to the defined location.
   */
  canMoveTo(locationCode) {
    return this.getTilesInMovementRange().includes(locationCode);
  }

  /*
   * This function will move the piece from its current location to it's intended
   * location regardless of whether that is a legal chess move.
   */
  moveTo(locationCode) {
    delete this.board[this.location];
    this.board[locationCode] = this;
    this.location = locationCode;
    this.timesMoved++;
  }

  /*
   * This function will move the piece to the location where it can capture
   * a different piece regardless of whether that is a legal chess move.
   */
  captureAt(locationCode) {
    this.board[locationCode].take();
    this.moveTo(locationCode);
  }

  /* this function removes this piece from the board regardless of whether it was
   * captured by any other piece, it is called when another piece captures this
   * one.
   */
  take() {
    delete this.board[this.location];
  }

  /*
   * TODO: THIS FITS BETTER IN A DISTINCT BOARD CLASS
   */
  isOccupied(locationCode) {
    return this.board[locationCode] != null;
  }

  getPieceCode() {
    return this.color + this.type;
  }

  getLocationCode() {
    return this.location;
  }

  getPieceLocationCode() {
    return getPieceCode() + ":" + getLocationCode();
  }

  isLocationCoordOnBoard(locationCoord) {
    let i = locationCoord[0];
    let j = locationCoord[1];
    return (i >= 0 && i < 8) && (j >= 0 && j < 8);
  }

  toCoordFromLocationCode(locationCode) {
    const coord = [];
    coord.push(locationCode.charCodeAt(0) - 97);
    coord.push(parseInt(locationCode.charAt(1)) - 1);
    return coord;
  }

  toLocationCodeFromCoord(coord) {
    return String.fromCharCode(coord[0] + 97) + (coord[1] + 1).toString();
  }
}

class King extends Piece {
  constructor(pieceLocationCode, board) {
    super(pieceLocationCode, board);
  }

  /*
   * This function returns an array containing all the locations that the king can
   * legally move to given his current position and surroundings.
   */
  getTilesInMovementRange() {
    let curLocationCoord = this.toCoordFromLocationCode(this.location);
    let moveSet = [];
    for (let i = curLocationCoord[0] - 1; i <= curLocationCoord[0] + 1; i++) {
      for (let j = curLocationCoord[1] - 1; j <= curLocationCoord[1] + 1; j++) {
        let tempLocationCoord = this.toLocationCodeFromCoord([i, j]);
        if ( this.isLocationCoordOnBoard([i, j])
              && !(i === curLocationCoord[0] && j === curLocationCoord[1]) )
          moveSet.push(this.toLocationCodeFromCoord([i, j]));
      }
    }
    return moveSet;
  }

  /*
   * This function returns a boolean representing whether the king can make
   * a move to the defined location.
   */
  canMoveTo(locationCode) {
    return this.getTilesInMovementRange().includes(locationCode);
  }
}

class Queen extends Piece {
  constructor(pieceLocationCode, board) {
    super(pieceLocationCode, board);
  }

  getTilesInMovementRange() {
    let curLocationCoord = this.toCoordFromLocationCode(this.location);
    let moveSet = [];
    let directions = [[1,0], [1,1], [0,1], [-1,1], [-1,0], [-1,-1], [0,-1], [1,-1]];
    for (let direction of directions) {
      let i;
      let j;
      for (i = curLocationCoord[0] + direction[0], j = curLocationCoord[1] + direction[1];
                i < 8 && j < 8 && i >= 0 && j >= 0; i += direction[0], j += direction[1]) {
        let endingLocation = this.toLocationCodeFromCoord([i,j]);
        if (this.board[endingLocation] == null) {
          moveSet.push(endingLocation);
          continue;
        } else if (this.board[endingLocation].color !== this.color)
          moveSet.push(endingLocation);
        break;
      }
    }
    return moveSet;
  }
}

class Knight extends Piece {
  constructor(pieceLocationCode, board) {
    super(pieceLocationCode, board);
  }

  getTilesInMovementRange() {
    let curLocationCoord = this.toCoordFromLocationCode(this.location);
    let moveSet = [];
    let moveCoords = [[curLocationCoord[0] + 2, curLocationCoord[1] + 1],
                      [curLocationCoord[0] + 1, curLocationCoord[1] + 2],
                      [curLocationCoord[0] - 1, curLocationCoord[1] + 2],
                      [curLocationCoord[0] - 2, curLocationCoord[1] + 1],
                      [curLocationCoord[0] - 2, curLocationCoord[1] - 1],
                      [curLocationCoord[0] - 1, curLocationCoord[1] - 2],
                      [curLocationCoord[0] + 1, curLocationCoord[1] - 2],
                      [curLocationCoord[0] + 2, curLocationCoord[1] - 1]];
    for (let move of moveCoords)
      if (this.isLocationCoordOnBoard(move))
        moveSet.push(this.toLocationCodeFromCoord(move));
    return moveSet;
  }
}

class Bishop extends Piece {
  constructor(pieceLocationCode, board) {
    super(pieceLocationCode, board);
  }

  getTilesInMovementRange() {
    let curLocationCoord = this.toCoordFromLocationCode(this.location);
    let moveSet = [];
    let directions = [[1,1], [1,-1], [-1,-1], [-1,1]];
    for (let direction of directions) {
      let i;
      let j;
      for (i = curLocationCoord[0] + direction[0], j = curLocationCoord[1] + direction[1];
                i < 8 && j < 8 && i >= 0 && j >= 0; i += direction[0], j += direction[1]) {
        let endingLocation = this.toLocationCodeFromCoord([i,j]);
        if (this.board[endingLocation] == null) {
          moveSet.push(endingLocation);
          continue;
        } else if (this.board[endingLocation].color !== this.color)
          moveSet.push(endingLocation);
        break;
      }
    }
    return moveSet;
  }
}

class Rook extends Piece {
  constructor(pieceLocationCode, board) {
    super(pieceLocationCode, board);
  }

  getTilesInMovementRange() {
    let curLocationCoord = this.toCoordFromLocationCode(this.location);
    let moveSet = [];
    let directions = [[1,0], [0,1], [-1,0], [0,-1]];
    for (let direction of directions) {
      let i;
      let j;
      for (i = curLocationCoord[0] + direction[0], j = curLocationCoord[1] + direction[1];
                i < 8 && j < 8 && i >= 0 && j >= 0; i += direction[0], j += direction[1]) {
        let endingLocation = this.toLocationCodeFromCoord([i,j]);
        if (this.board[endingLocation] == null) {
          moveSet.push(endingLocation);
          continue;
        } else if (this.board[endingLocation].color !== this.color)
          moveSet.push(endingLocation);
        break;
      }
    }
    return moveSet;
  }
}

class Pawn extends Piece {
  constructor(pieceLocationCode, board) {
    super(pieceLocationCode, board);
  }

  getTilesInMovementRange() {
    let curLocationCoord = this.toCoordFromLocationCode(this.location);
    let moveSet = [];
    let direction = (this.color === 'w') ? 1 : -1;
    let potentialMoves = [[curLocationCoord[0], curLocationCoord[1] + (1 * direction)],
                      [curLocationCoord[0], curLocationCoord[1]  + (2 * direction)]];
    if (this.board[potentialMoves[0]] != null)
      return moveSet;
    moveSet.push(this.toLocationCodeFromCoord(potentialMoves[0]));
    if (this.board[potentialMoves[1]] == null && this.timesMoved === 0)
      moveSet.push(this.toLocationCodeFromCoord(potentialMoves[1]));
    return moveSet;
  }

  canMoveTo(locationCode) {
    return this.getTilesInMovementRange().includes(locationCode);
  }

  getTilesInCaptureRange() {
    let curLocationCoord = this.toCoordFromLocationCode(this.location);
    let moveSet = [];
    let direction = (this.color === 'w') ? 1 : -1;
    let potentialMoves = [[curLocationCoord[0] + 1, curLocationCoord[1] + direction],
                      [curLocationCoord[0] - 1, curLocationCoord[1] + direction]];
    if (this.board[this.toLocationCodeFromCoord(potentialMoves[0])] != null
          && this.board[this.toLocationCodeFromCoord(potentialMoves[0])].color !== this.color)
      moveSet.push(this.toLocationCodeFromCoord(potentialMoves[0]));
    if (this.board[this.toLocationCodeFromCoord(potentialMoves[1])] != null
          && this.board[this.toLocationCodeFromCoord(potentialMoves[1])].color !== this.color)
      moveSet.push(this.toLocationCodeFromCoord(potentialMoves[1]));
    console.log(moveSet);
    return moveSet;
  }

  canCaptureAt(locationCode) {

    return this.getTilesInCaptureRange().includes(locationCode);
  }

  performLegalMove(locationCode) {
    if (!this.isOccupied(locationCode)) {
      if (this.canMoveTo(locationCode)) {
        this.moveTo(locationCode);
        return true;
      }
    } else {
      if (this.canCaptureAt(locationCode)) {
        this.captureAt(locationCode);
        return true;
      }
    }
    return false;
  }
}

class Player {
  constructor(color) {
    this.color = color; // should be 'w' or 'b'
    this.pieces = [];
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
  constructor(pieceLocationCodes = defaultBoardLayout) {
      this.players = {
        'w' : new Player('w'),
        'b' : new Player('b')
      };
      this.curPlayer = this.players['w'];
      this.board = {};
      this.turnCounter = 1;

      for (let pieceLocationCode of pieceLocationCodes) {
        const locationCode = pieceLocationCode.split(":")[1];
        let piece;
        switch (pieceLocationCode.split(":")[0].charAt(1)) {
          case 'K':
            piece = new King(pieceLocationCode, this.board);
            break;
          case 'Q':
            piece = new Queen(pieceLocationCode, this.board);
            break;
          case 'N':
            piece = new Knight(pieceLocationCode, this.board);
            break;
          case 'B':
            piece = new Bishop(pieceLocationCode, this.board);
            break;
          case 'R':
            piece = new Rook(pieceLocationCode, this.board);
            break;
          case 'P':
            piece = new Pawn(pieceLocationCode, this.board);
            break;
        }
        this.board[locationCode] = piece;
        if (piece.color === 'w')
          this.players['w'].pieces.push(piece);
        else
          this.players['b'].pieces.push(piece);
      }
  }

  getOtherPlayer(player) {
    let playerSwitch = {
      'w' : this.players['b'],
      'b' : this.players['w']
    };
    return playerSwitch[player.color];
  }

  progressGameStats() {
    this.turnCounter++;
    this.curPlayer = this.getOtherPlayer(this.curPlayer);
  }

  /*
   * Will interpret the given moveCommand and either advance the game and
   * return true state or reject the moveCommandCommand and return false.
   *
   * ****EXPOSED TO FRONT END****
   */
  interpretCommand(moveCommand) {
    console.log(moveCommand);

    const startingLocation = moveCommand.split(" ")[0];
    const endingLocation = moveCommand.split(" ")[1];
    const movingPiece = this.board[startingLocation];
    if (movingPiece.color !== this.curPlayer.color) {
      console.log("not your turn!");
      return;
    }
    if (this.board[endingLocation] === this.board[startingLocation]) {
      console.log("You didn't move...");
      return;
    }
    if (this.board[endingLocation] != null && this.board[endingLocation].color  === this.curPlayer.color) {
      console.log("Don't take your own piece!")
      return;
    }
    if (movingPiece.performLegalMove(endingLocation))
      this.progressGameStats();
    else {
      console.log("invalid move!");
    }
  }

  /*
   * Returns the state of the game in the form of an array of pieceLocationCodes.
   *
   * ****EXPOSED TO FRONT END****
   */
  getGameState() {
    const pieceLocationCodes = [];
    for (let location in this.board)
      if (this.board[location])
        pieceLocationCodes.push(this.board[location].getPieceCode() + ":" + location);
    return pieceLocationCodes;
  }

  /*
   * Returns either 'w' or 'b' indiccating which player's turn it currently is.
   *
   * ****EXPOSED TO FRONT END****
   */
  getCurrentPlayer() {
      return this.curPlayer.color;
  }

  getCurrentTurn() {
    return this.turnCounter;
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
const turnCounter = document.querySelector('#turnCounter');
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
document.addEventListener('onload', displayGameStats());

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
  chessEngine.interpretCommand(generateMoveCommand(startLocation, this));

  clearDisplay();
  displayGameState();
  displayGameStats();
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
function displayGameStats() {
  turnLabel.innerText = (chessEngine.getCurrentPlayer() === 'w') ? 'white': 'black';
  turnCounter.innerText = chessEngine.getCurrentTurn();
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
