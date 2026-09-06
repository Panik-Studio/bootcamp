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

  updateInstructor();
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
      updateInstructor();
    }
  };
}

function updateInstructor() {
  let moves = game.moves({ verbose: true });
  let msg = 'Make your move, soldier.';

  for (let m of moves) {
    let temp = new Chess(game.fen());
    temp.move(m);
    let attacks = temp.moves({ verbose: true }).filter(x => x.captured);
    if (attacks.length >= 2) {
      msg = 'This is a fork, soldier! Wins you material!';
      break;
    }
    if (attacks.length === 1) msg = 'You can win material here!';
  }

  document.getElementById('message').innerText = msg;
}
