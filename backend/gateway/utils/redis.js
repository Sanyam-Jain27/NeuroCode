import Redis from "ioredis"

class MemoryRedis {
  constructor() {
    this.store = new Map()
    console.log("[REDIS] Using in-memory fallback store")
  }
  async get(key) {
    return this.store.get(key) || null
  }
  async set(key, val) {
    this.store.set(key, String(val))
    return "OK"
  }
  async del(key) {
    return this.store.delete(key) ? 1 : 0
  }
  on() {
    return this
  }
}

function isValidRedisUrl(str) {
  if (!str) return false
  if (str.includes("(") || str.includes("<") || str.includes("Your Upstash") || str.includes("your-")) {
    return false
  }
  try {
    const formatted = str.replace(/^http:\/\//, "redis://")
    new URL(formatted)
    return true
  } catch {
    return false
  }
}

let redis
const rawUrl = process.env.REDIS_URL

if (isValidRedisUrl(rawUrl)) {
  try {
    const redisUrl = rawUrl.replace(/^http:\/\//, "redis://")
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      retryStrategy(times) {
        return Math.min(times * 100, 3000)
      }
    })
    redis.on("connect", () => {
      console.log("Redis connected successfully")
    })
    redis.on("error", (err) => {
      console.error("Redis connection error:", err.message)
    })
  } catch (err) {
    console.error("Redis init failed, falling back to memory store:", err.message)
    redis = new MemoryRedis()
  }
} else {
  redis = new MemoryRedis()
}

export default redis
