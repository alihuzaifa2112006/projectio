import connectDB from '../../../config/db.js'
import Employee from '../../../lib/models/Employee'
import BillingRecord from '../../../lib/models/BillingRecord'
import { requireAuth } from '../../../lib/auth'

const getCurrentMonthYear = () => {
  const d = new Date()
  return { month: d.getMonth() + 1, year: d.getFullYear() }
}

export async function GET(request) {
  const auth = await requireAuth(request, ['admin', 'employee'])
  if (auth.error) return auth.error
  try {
    await connectDB()
    const { month, year } = getCurrentMonthYear()
    let employees = await Employee.find().select('name salary')
    if (auth.user.role === 'employee') {
      employees = employees.filter((e) => String(e._id) === String(auth.user.id))
    }
    const records = await BillingRecord.find({ month, year })
    const recordMap = {}
    records.forEach((r) => { recordMap[r.employee.toString()] = r })
    const list = employees.map((emp) => ({
      _id: emp._id,
      name: emp.name,
      salary: emp.salary,
      managerConfirmed: recordMap[emp._id.toString()]?.managerConfirmed ?? false,
      employeeConfirmed: recordMap[emp._id.toString()]?.employeeConfirmed ?? false,
      recordId: recordMap[emp._id.toString()]?._id,
    }))
    return Response.json({ list, month, year }, { status: 200 })
  } catch (error) {
    return Response.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request) {
  const auth = await requireAuth(request, ['admin', 'employee'])
  if (auth.error) return auth.error
  try {
    await connectDB()
    const { employeeId, managerConfirmed, employeeConfirmed } = await request.json()
    if (!employeeId) {
      return Response.json({ message: 'Employee ID is required' }, { status: 400 })
    }
    const { month, year } = getCurrentMonthYear()
    let record = await BillingRecord.findOne({ employee: employeeId, month, year })
    if (!record) {
      record = await BillingRecord.create({ employee: employeeId, month, year })
    }
    if (auth.user.role === 'employee') {
      if (String(employeeId) !== String(auth.user.id)) {
        return Response.json({ message: 'You can only update your own record' }, { status: 403 })
      }
      if (typeof managerConfirmed === 'boolean') {
        return Response.json({ message: 'Only manager can confirm salary approval' }, { status: 403 })
      }
      if (typeof employeeConfirmed === 'boolean' && employeeConfirmed === true && !record.managerConfirmed) {
        return Response.json({ message: 'Manager must confirm salary first' }, { status: 403 })
      }
    }
    if (auth.user.role === 'admin') {
      if (typeof managerConfirmed === 'boolean') record.managerConfirmed = managerConfirmed
    }
    if (typeof employeeConfirmed === 'boolean') record.employeeConfirmed = employeeConfirmed
    await record.save()
    return Response.json({ message: 'Updated', record }, { status: 200 })
  } catch (error) {
    return Response.json({ message: 'Internal server error' }, { status: 500 })
  }
}
