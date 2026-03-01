import connectDB from '../../../config/db.js'
import User from '../../../../lib/models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function POST(request) {
  try {
    await connectDB()

    const { name, email, password, number } = await request.json()

    if (!name || !email || !password) {
      return Response.json({ message: 'Name, email aur password chahiye' }, { status: 400 })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return Response.json({ message: 'Email pehle se registered hai' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 8)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      number: number || '',
      role: 'user',
    })

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: 'user' },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    return Response.json(
      {
        message: 'User registered successfully',
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return Response.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}
