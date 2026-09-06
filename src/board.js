import { Chessground } from 'chessground'

export function createBoard(game, onMove) {
  const board = Chessground(document.getElementById('board'), {
    fen: game.fen(),
    draggable: true,
    highlight: {
      lastMove: true,
      check: true
    }
  })

  board.set({
    movable: {
      free: false,
      color: 'white',
      dests: computeDests(game)
    },
    events: {
      move: (orig, dest) => onMove(orig, dest, board)
    }
  })

  return board
}

function computeDests(game) {
  const dests = new Map()
  game.SQUARES.forEach(sq => {
    const moves = game.moves({ square: sq, verbose: true })
    if (moves.length) dests.set(sq, moves.map(m => m.to))
  })
  return dests
}
