import connectDB from '../../../config/db.js'
import mongoose from 'mongoose'
import RegisterSchema from '../../../../lib/models/Register'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const Register = mongoose.models.Register || mongoose.model('Register', RegisterSchema)

export async function POST(request) {
  try {
    await connectDB()

    const { name, email, number, password, role } = await request.json()

    if (!name || !email || !number || !password || !role) {
      return Response.json({ message: 'All fields are required' }, { status: 400 })
    }

    const existingRegister = await Register.findOne({ email })
    if (existingRegister) {
      return Response.json({ message: 'Register already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 8)
    const newRegister = await Register.create({
      name,
      email,
      number,
      password: hashedPassword,
      role,
    })

    const token = jwt.sign(
      { id: newRegister._id, email: newRegister.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    return Response.json(
      {
        message: 'Manager registered successfully',
        token,
        user: {
          id: newRegister._id,
          name: newRegister.name,
          email: newRegister.email,
          role: newRegister.role,
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