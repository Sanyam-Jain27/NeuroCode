import Redis from "ioredis"

const rawUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379"
const redisUrl = rawUrl.replace(/^http:\/\//, "redis://")

const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    retryStrategy(times) {
        return Math.min(times * 100, 3000)
    }
})

redis.on("connect", () => {
    console.log("redis connected")
})

redis.on("error", (err) => {
    console.error("Redis connection error:", err.message)
})

export default redis
