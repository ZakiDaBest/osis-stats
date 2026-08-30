import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import StatisticsDashboard from '@/components/statistics-dashboard'
import { fetchDashboardData } from '@/lib/google-script'

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  let data = { candidates: [], votes: [], totalVoters: 0, sessionStatus: 'locked' }
  try {
    const json = await fetchDashboardData()
    if (json.result === 'success') data = json
  } catch { /* dashboard renders an empty state when the source is unavailable */ }
  return <StatisticsDashboard data={data} adminName={session.user.name || session.user.email} />
}

export const dynamic = 'force-dynamic'
