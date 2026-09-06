let wasmSupported = typeof WebAssembly === 'object';
let engine = new Worker(wasmSupported ? 'stockfish.wasm.js' : 'stockfish.js');

engine.postMessage('uci');

let game = new Chess();
let board = Chessboard('board', {
  draggable: true,
  position: 'start',
  onDrop: onDrop
});

function onDrop(source, target) {
  let move = game.move({ from: source, to: target, promotion: 'q' });
  if (move === null) return 'snapback';

  updateInstructor('You moved: ' + move.san);
  setTimeout(stockfishMove, 200);
}

function stockfishMove() {
  engine.postMessage('position fen ' + game.fen());
  engine.postMessage('go depth 12');

  engine.onmessage = function (e) {
    if (e.data.startsWith('bestmove')) {
      let move = e.data.split(' ')[1];
      game.move(move);
      board.position(game.fen());
      updateInstructor('Stockfish plays: ' + move);
    }
  };
}

function updateInstructor(msg) {
  document.getElementById('message').innerText = msg;
}
