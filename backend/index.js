import { spawn } from "child_process"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const children = []

const gatewayPort = process.env.PORT || 10000

const services = [
  {
    name: "auth",
    dir: path.join(__dirname, "services", "auth"),
    env: { PORT: "8001", NODE_ENV: process.env.NODE_ENV || "production" }
  },
  {
    name: "project",
    dir: path.join(__dirname, "services", "project"),
    env: { PORT: "8002", NODE_ENV: process.env.NODE_ENV || "production" }
  },
  {
    name: "file",
    dir: path.join(__dirname, "services", "file"),
    env: { PORT: "8003", NODE_ENV: process.env.NODE_ENV || "production" }
  },
  {
    name: "ai",
    dir: path.join(__dirname, "services", "ai"),
    env: {
      PORT: "8004",
      FILE_SERVICE_URL: "http://127.0.0.1:8003",
      AUTH_SERVICE: "http://127.0.0.1:8001",
      NODE_ENV: process.env.NODE_ENV || "production"
    }
  },
  {
    name: "terminal",
    dir: path.join(__dirname, "services", "terminal"),
    env: {
      PORT: "8005",
      FILE_SERVICE_URL: "http://127.0.0.1:8003",
      NODE_ENV: process.env.NODE_ENV || "production"
    }
  },
  {
    name: "payment",
    dir: path.join(__dirname, "services", "payment"),
    env: {
      PORT: "8006",
      AUTH_SERVICE: "http://127.0.0.1:8001",
      NODE_ENV: process.env.NODE_ENV || "production"
    }
  },
  {
    name: "gateway",
    dir: path.join(__dirname, "gateway"),
    env: {
      PORT: String(gatewayPort),
      AUTH_SERVICE: "http://127.0.0.1:8001",
      PROJECT_SERVICE: "http://127.0.0.1:8002",
      FILE_SERVICE: "http://127.0.0.1:8003",
      AI_SERVICE: "http://127.0.0.1:8004",
      TERMINAL_SERVICE: "http://127.0.0.1:8005",
      PAYMENT_SERVICE: "http://127.0.0.1:8006",
      NODE_ENV: process.env.NODE_ENV || "production"
    }
  }
]

function startService(svc) {
  const child = spawn("node", ["index.js"], {
    cwd: svc.dir,
    env: { ...process.env, ...svc.env },
    stdio: ["pipe", "pipe", "pipe"]
  })

  child.stdout.on("data", (data) => {
    const lines = data.toString().trim().split("\n")
    for (const line of lines) {
      if (line) console.log(`[${svc.name.toUpperCase()}] ${line}`)
    }
  })

  child.stderr.on("data", (data) => {
    const lines = data.toString().trim().split("\n")
    for (const line of lines) {
      if (line) console.error(`[${svc.name.toUpperCase()}] ${line}`)
    }
  })

  child.on("exit", (code, signal) => {
    console.log(`[${svc.name.toUpperCase()}] Process exited with code ${code || signal}`)
  })

  children.push(child)
}

console.log(`Starting NeuroCode unified backend (Main Port: ${gatewayPort})...`)
for (const svc of services) {
  startService(svc)
}

function cleanup() {
  console.log("Shutting down all services...")
  for (const child of children) {
    try {
      child.kill("SIGTERM")
    } catch (e) {}
  }
  process.exit(0)
}

process.on("SIGINT", cleanup)
process.on("SIGTERM", cleanup)
