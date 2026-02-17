import { Router } from "express"
import { googleLogin } from "../controllers/auth.controller"

const router = Router()

router.post("/google", googleLogin)

router.get("/google", (req, res) => {
  res.send("Google auth route alive ✅ (POST only)")
})

export default router
