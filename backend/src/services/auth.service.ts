import { Request, Response } from "express"
import { OAuth2Client } from "google-auth-library"
import jwt from "jsonwebtoken"
import User from "../models/user"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload) {
      return res.status(401).json({ success: false, message: "Invalid token" })
    }

    const { name, email } = payload

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        name,
        email,
      })
    }

    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    )

    res.json({
      success: true,
      token: jwtToken,
      user,
    })
  } catch (error) {
    res.status(401).json({ success: false, message: "Google auth failed" })
  }
}
