import connectDB from '../../../config/db.js'
import mongoose from 'mongoose'
import RegisterSchema from '../../../../lib/models/Register'
import User from '../../../../lib/models/User'
import Employee from '../../../../lib/models/Employee'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const Register = mongoose.models.Register || mongoose.model('Register', RegisterSchema)

export async function POST(request) {
  try {
    await connectDB()

    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ message: 'Email aur password chahiye' }, { status: 400 })
    }

    // Pehle Register (manager/admin) mein check karo
    const manager = await Register.findOne({ email })
    if (manager) {
      const isMatch = await bcrypt.compare(password, manager.password)
      if (isMatch) {
        const token = jwt.sign(
          { id: manager._id, email: manager.email, role: 'admin' },
          process.env.JWT_SECRET || 'fallback-secret',
          { expiresIn: '7d' }
        )
        return Response.json({
          message: 'Manager login successful',
          token,
          user: {
            id: manager._id,
            name: manager.name,
            email: manager.email,
            role: 'admin',
          },
        })
      }
      return Response.json({ message: 'Invalid password' }, { status: 401 })
    }

    // Manager nahi mila - User table mein check karo
    const user = await User.findOne({ email })
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password)
      if (isMatch) {
        const token = jwt.sign(
          { id: user._id, email: user.email, role: 'user' },
          process.env.JWT_SECRET || 'fallback-secret',
          { expiresIn: '7d' }
        )
        return Response.json({
          message: 'User login successful',
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        })
      }
      return Response.json({ message: 'Invalid password' }, { status: 401 })
    }

    // User nahi mila - Employee table mein check karo (manager ne add kiye hue employees)
    const emp = await Employee.findOne({ email })
    if (emp) {
      const isMatch = await bcrypt.compare(password, emp.password)
      if (isMatch) {
        const token = jwt.sign(
          { id: emp._id, email: emp.email, role: 'employee' },
          process.env.JWT_SECRET || 'fallback-secret',
          { expiresIn: '7d' }
        )
        return Response.json({
          message: 'Employee login successful',
          token,
          user: {
            id: emp._id,
            name: emp.name,
            email: emp.email,
            role: 'employee',
          },
        })
      }
      return Response.json({ message: 'Invalid password' }, { status: 401 })
    }

    // Kahi bhi user nahi mila
    return Response.json({ message: 'No user found' }, { status: 404 })
  } catch (error) {
    console.error(error)
    return Response.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}
