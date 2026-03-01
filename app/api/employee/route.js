import connectDB from '../../../config/db.js'
import Employee from '../../../lib/models/Employee'
import bcrypt from 'bcrypt'
import { requireAuth } from '../../../lib/auth'

export async function POST(request) {
  const auth = await requireAuth(request, ['admin'])
  if (auth.error) return auth.error
  try {
    await connectDB()
        const { name, designation, salary, email, phone, password } = await request.json()
        if(!name || !designation || !salary || !email || !phone || !password){
            return Response.json({ message: 'All fields are required' }, { status: 400 })
        }
        const existingEmployee = await Employee.findOne({ email })
        if(existingEmployee){
            return Response.json({ message: 'Employee already exists' }, { status: 400 })
        }
        const hashedPassword = await bcrypt.hash(password, 8)
        const newEmployee = await Employee.create({ name, designation, salary, email, phone, password: hashedPassword })
        return Response.json({ message: 'Employee created successfully', employee: newEmployee }, { status: 201 })
    }catch(error){
        return Response.json({ message: 'Internal server error' }, { status: 500 })
    }
}

export async function GET(request) {
  const auth = await requireAuth(request, ['admin', 'employee'])
  if (auth.error) return auth.error
  try {
    await connectDB()
        const employees = await Employee.find()
        return Response.json({ employees }, { status: 200 })
    }catch(error){
        return Response.json({ message: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request) {
  const auth = await requireAuth(request, ['admin'])
  if (auth.error) return auth.error
  try {
    await connectDB()
        const {id} = await request.json()
        if(!id){
            return Response.json({ message: 'Employee ID is required' }, { status: 400 })
        }
        await Employee.findByIdAndDelete(id)
        return Response.json({ message: 'Employee deleted successfully' }, { status: 200 })
    }catch(error){
        return Response.json({ message: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(request) {
  const auth = await requireAuth(request, ['admin'])
  if (auth.error) return auth.error
  try {
    await connectDB()
        const {id, name, designation, salary, email, phone, password} = await request.json()
        if(!id || !name || !designation || !salary || !email || !phone){
            return Response.json({ message: 'Name, designation, salary, email and phone are required' }, { status: 400 })
        }
        const updateData = { name, designation, salary, email, phone }
        if (password?.trim()) {
          updateData.password = await bcrypt.hash(password, 8)
        }
        await Employee.findByIdAndUpdate(id, updateData)
        return Response.json({ message: 'Employee updated successfully' }, { status: 200 })
    }catch(error){
        return Response.json({ message: 'Internal server error' }, { status: 500 })
    }
}