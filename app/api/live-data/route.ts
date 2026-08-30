import { fetchDashboardData } from '@/lib/google-script'

export async function GET() {
  try {
    const data = await fetchDashboardData()
    return Response.json(data, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return Response.json({ result: 'error', candidates: [], votes: [], totalVoters: 0, sessionStatus: 'unknown' }, { status: 503 })
  }
}
