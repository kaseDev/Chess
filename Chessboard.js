let tiles = document.querySelectorAll('.tile');
let pieces = document.querySelectorAll('.piece');
let heldPiece = null;
let startLocaiton = null;
const turnLabel = document.querySelector('#turnLabel');

for (const tile of tiles) {
  tile.addEventListener('dragover', dragOver);
  tile.addEventListener('dragenter', dragEnter);
  tile.addEventListener('dragleave', dragLeave);
  tile.addEventListener('drop', dragDrop);
}

for (const piece of pieces) {
  piece.addEventListener('dragstart', dragStart);
  piece.addEventListener('dragend', dragEnd);
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
  // this line would move the piece from its location to "this"
  // this.append(heldPiece);
  console.log(movePiece(startLocation, this));
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
function movePiece(start, end) {
  return start.id + " " + end.id;
}

/* Call this by passing the number 1 or 2 in order to
 * set the label stating whose turn it is.
 */
function setPlayerTurn(playerNumber) {
  turnLabel.innerText = "It is Player " + playerNumber + "'s turn.";
}
