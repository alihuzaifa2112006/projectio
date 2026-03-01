import connectDB from '../../../config/db.js'
import Project from '../../../lib/models/Project'
import { requireAuth } from '../../../lib/auth'

export async function POST(request) {
  const auth = await requireAuth(request, ['admin'])
  if (auth.error) return auth.error
  try {
    await connectDB()
    const { name, description, status, employees } = await request.json()
    if (!name) {
      return Response.json({ message: 'Project name is required' }, { status: 400 })
    }
    const newProject = await Project.create({
      name,
      description: description || '',
      status: status || 'active',
      employees: employees || [],
    })
    return Response.json({ message: 'Project created successfully', project: newProject }, { status: 201 })
  } catch (error) {
    return Response.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request) {
  const auth = await requireAuth(request, ['admin', 'employee'])
  if (auth.error) return auth.error
  try {
    await connectDB()
    const projects = await Project.find().populate('employees', 'name designation email')
    return Response.json({ projects }, { status: 200 })
  } catch (error) {
    return Response.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request) {
  const auth = await requireAuth(request, ['admin'])
  if (auth.error) return auth.error
  try {
    await connectDB()
    const { id } = await request.json()
    if (!id) {
      return Response.json({ message: 'Project ID is required' }, { status: 400 })
    }
    await Project.findByIdAndDelete(id)
    return Response.json({ message: 'Project deleted successfully' }, { status: 200 })
  } catch (error) {
    return Response.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request) {
  const auth = await requireAuth(request, ['admin'])
  if (auth.error) return auth.error
  try {
    await connectDB()
    const { id, name, description, status, employees } = await request.json()
    if (!id || !name) {
      return Response.json({ message: 'Project ID and name are required' }, { status: 400 })
    }
    const updateData = { name, description: description || '', status: status || 'active' }
    if (Array.isArray(employees)) updateData.employees = employees
    await Project.findByIdAndUpdate(id, updateData)
    return Response.json({ message: 'Project updated successfully' }, { status: 200 })
  } catch (error) {
    return Response.json({ message: 'Internal server error' }, { status: 500 })
  }
}
