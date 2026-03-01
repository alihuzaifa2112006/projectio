// Check if env vars are configured - helps debug Vercel deployment
export async function GET() {
  const hasMongo = !!(process.env.Mongoose_URI || process.env.MONGODB_URI || process.env.DATABASE_URL)
  const hasJwt = !!process.env.JWT_SECRET
  return Response.json({
    mongoConfigured: hasMongo,
    jwtConfigured: hasJwt,
    hint: !hasMongo ? 'Add Mongoose_URI in Vercel: Settings > Environment Variables' : 'OK',
  })
}
