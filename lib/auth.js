import jwt from 'jsonwebtoken'

export function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  return authHeader.slice(7)
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    return { id: decoded.id, email: decoded.email, role: decoded.role }
  } catch (e) {
    return null
  }
}

export async function requireAuth(request, allowedRoles = ['admin']) {
  const token = getTokenFromRequest(request)
  if (!token) return { error: Response.json({ message: 'Unauthorized' }, { status: 401 }) }
  const user = verifyToken(token)
  if (!user) return { error: Response.json({ message: 'Invalid token' }, { status: 401 }) }
  if (!allowedRoles.includes(user.role)) return { error: Response.json({ message: 'Forbidden' }, { status: 403 }) }
  return { user }
}
