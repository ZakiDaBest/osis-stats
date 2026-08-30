const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxOWGpev50hGcBHssVfKpjtT-4GD9uU2gli0Kgwump-TlFoSYXRuynn4rouGL0dPJa6IQ/exec'

export async function GET() {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=getDashboardData`, { cache: 'no-store' })
    const data = await response.json()
    return Response.json(data, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return Response.json({ result: 'error', candidates: [], votes: [], totalVoters: 0, sessionStatus: 'unknown' }, { status: 503 })
  }
}
