import { GOOGLE_SCRIPT_URL } from '@/lib/google-script'

export async function GET() {
  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getDashboardData`, { cache: 'no-store' })
    const data = await response.json()
    return Response.json(data, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return Response.json({ result: 'error', candidates: [], votes: [], totalVoters: 0, sessionStatus: 'unknown' }, { status: 503 })
  }
}
