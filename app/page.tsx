import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import StatisticsDashboard from '@/components/statistics-dashboard'

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxOWGpev50hGcBHssVfKpjtT-4GD9uU2gli0Kgwump-TlFoSYXRuynn4rouGL0dPJa6IQ/exec'

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  let data = { candidates: [], votes: [], totalVoters: 0, sessionStatus: 'locked' }
  try {
    const response = await fetch(`${SCRIPT_URL}?action=getDashboardData`, { cache: 'no-store' })
    const json = await response.json()
    if (json.result === 'success') data = json
  } catch { /* dashboard renders an empty state when the source is unavailable */ }
  return <StatisticsDashboard data={data} adminName={session.user.name || session.user.email} />
}

export const dynamic = 'force-dynamic'
