import connectDB from '../../../config/db.js'
import Team from '../../../lib/models/Team'
import { requireAuth } from '../../../lib/auth'

export async function POST(request) {
  const auth = await requireAuth(request, ['admin'])
  if (auth.error) return auth.error
  try {
    await connectDB()
    const { name, assignedWork, employees } = await request.json()
    if (!name?.trim()) {
      return Response.json({ message: 'Team name is required' }, { status: 400 })
    }
    const newTeam = await Team.create({
      name: name.trim(),
      assignedWork: assignedWork || '',
      employees: employees || [],
    })
    return Response.json({ message: 'Team created successfully', team: newTeam }, { status: 201 })
  } catch (error) {
    return Response.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request) {
  const auth = await requireAuth(request, ['admin', 'employee'])
  if (auth.error) return auth.error
  try {
    await connectDB()
    const teams = await Team.find().populate('employees', 'name designation email')
    return Response.json({ teams }, { status: 200 })
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
      return Response.json({ message: 'Team ID is required' }, { status: 400 })
    }
    await Team.findByIdAndDelete(id)
    return Response.json({ message: 'Team deleted successfully' }, { status: 200 })
  } catch (error) {
    return Response.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request) {
  const auth = await requireAuth(request, ['admin'])
  if (auth.error) return auth.error
  try {
    await connectDB()
    const { id, name, assignedWork, employees } = await request.json()
    if (!id || !name?.trim()) {
      return Response.json({ message: 'Team ID and name are required' }, { status: 400 })
    }
    const updateData = { name: name.trim(), assignedWork: assignedWork || '' }
    if (Array.isArray(employees)) updateData.employees = employees
    await Team.findByIdAndUpdate(id, updateData)
    return Response.json({ message: 'Team updated successfully' }, { status: 200 })
  } catch (error) {
    return Response.json({ message: 'Internal server error' }, { status: 500 })
  }
}
