import { createRequestHandler } from '@react-router/node'
import http from 'node:http'

// import SSR build
const build = await import('./build/server/index.js')

// create handler
const handler = createRequestHandler(build)

// create HTTP server
const server = http.createServer((req, res) => {
  handler(req, res)
})

// listen
const port = process.env.PORT || 8386
server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 React Router SSR running on port ${port}`)
})
