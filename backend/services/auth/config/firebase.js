import { cert, initializeApp } from "firebase-admin";
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let serviceAccount = null

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  } catch (err) {
    console.error("Error parsing FIREBASE_SERVICE_ACCOUNT:", err.message)
  }
}

if (!serviceAccount) {
  const keyPath = path.join(__dirname, "..", "serviceAccountKey.json")
  if (fs.existsSync(keyPath)) {
    try {
      serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf-8"))
    } catch (err) {
      console.error("Error reading serviceAccountKey.json:", err.message)
    }
  }
}

export const app = initializeApp({
  credential: cert(serviceAccount)
})