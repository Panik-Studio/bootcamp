export function highlightVision(board, game) {
  const squares = []

  const moves = game.moves({ verbose: true })
  moves.forEach(m => squares.push(m.to))

  board.set({
    highlight: {
      squares
    }
  })
}
