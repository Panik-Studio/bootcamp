export function initEngine() {
  const engine = new Worker('/stockfish.js')
  engine.send = (cmd) => engine.postMessage(cmd)
  return engine
}
