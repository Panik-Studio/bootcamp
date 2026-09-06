import { Chess } from 'chess.js'
import { createBoard } from './board.js'
import { initEngine } from './engine.js'
import { highlightVision } from './tactics.js'
import { updateInstructor } from './instructor.js'

const game = new Chess()
const engine = initEngine()

const board = createBoard(game, handlePlayerMove)

function handlePlayerMove(orig, dest, board) {
  const move = game.move({ from: orig, to: dest, promotion: 'q' })
  if (!move) return

  updateInstructor(`You moved: ${move.san}`)
  board.set({ fen: game.fen() })

  highlightVision(board, game)

  setTimeout(() => engineMove(board), 200)
}

function engineMove(board) {
  engine.send(`position fen ${game.fen()}`)
  engine.send('go depth 12')

  engine.onmessage = (line) => {
    if (line.startsWith('bestmove')) {
      const move = line.split(' ')[1]
      game.move(move)
      board.set({ fen: game.fen() })
      updateInstructor(`Stockfish plays: ${move}`)
      highlightVision(board, game)
    }
  }
}

