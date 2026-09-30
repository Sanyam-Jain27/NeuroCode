import express from "express"
import proxy from "express-http-proxy"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { protect } from "./middleware/protect.js"
import { getCurrentUser } from "./controllers/user.controller.js"
import { proxyWithHeader } from "./utils/proxyWithHeader.js"
import cors from "cors"
import morgan from "morgan"
import http from "http"
import httpProxy from "http-proxy"
dotenv.config()
const port = process.env.PORT || 8000

const app = express()
app.set("trust proxy", 1)
const corsOptions = {
    origin: (origin, callback) => {
        callback(null, true)
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}
app.use(cors(corsOptions))
app.options("*", cors(corsOptions))

app.use(cookieParser())
app.use(morgan("dev"))
const server = http.createServer(app)
app.use("/api/auth", proxy(process.env.AUTH_SERVICE || "http://localhost:8001"))
app.use("/api/project", protect, proxyWithHeader(process.env.PROJECT_SERVICE || "http://localhost:8002"))
app.use("/api/file", protect, proxyWithHeader(process.env.FILE_SERVICE || "http://localhost:8003"))
app.use("/api/ai", protect, proxyWithHeader(process.env.AI_SERVICE || "http://localhost:8004"))
app.use("/api/terminal", protect, proxy(process.env.TERMINAL_SERVICE || "http://localhost:8005"))
app.use("/api/payment", protect, proxyWithHeader(process.env.PAYMENT_SERVICE || "http://localhost:8006"))
app.get("/api/me", protect, getCurrentUser)

app.get("/", (req, res) => {
    res.json({ "message": "hello from gateway" })
})

const socketProxy=httpProxy.createProxyServer({
    target:process.env.TERMINAL_SERVICE || "http://localhost:8005",
    ws:true
})

socketProxy.on("error", (err, req, res) => {
    console.error("Socket proxy error:", err.message)
    if (res && res.writeHead && !res.headersSent) {
        res.writeHead(502, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ error: "Terminal service unavailable" }))
    }
})

app.use("/socket.io",(req,res)=>{
   socketProxy.web(req,res,{
      target:process.env.TERMINAL_SERVICE || "http://localhost:8005"
   })
})

server.on("upgrade",(req,socket,head)=>{
    if(req.url.startsWith("/socket.io")){
        socketProxy.ws(req,socket,head,{
            target:process.env.TERMINAL_SERVICE || "http://localhost:8005"
        })
    }
})

server.listen(port, "0.0.0.0", () => {
    console.log(`gateway started at ${port}`)
})