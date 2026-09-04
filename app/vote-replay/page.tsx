import VoteReplay from '@/components/vote-replay'
import { fetchDashboardData } from '@/lib/google-script'

export const dynamic = 'force-dynamic'

export default async function VoteReplayPage() {
  let data = { candidates: [], votes: [], totalVoters: 0, sessionStatus: 'unknown' }
  try {
    const json = await fetchDashboardData()
    if (json.result === 'success') data = json
  } catch { /* client refresh can recover when the source is temporarily unavailable */ }
  return <VoteReplay initialData={data} />
}
