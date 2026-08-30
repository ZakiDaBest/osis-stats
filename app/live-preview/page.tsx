import LivePreview from '@/components/live-preview'
import { GOOGLE_SCRIPT_URL } from '@/lib/google-script'

export const dynamic = 'force-dynamic'

export default async function LivePreviewPage() {
  let data = { candidates: [], votes: [], totalVoters: 0, sessionStatus: 'unknown' }
  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getDashboardData`, { cache: 'no-store' })
    const json = await response.json()
    if (json.result === 'success') data = json
  } catch { /* client refresh can recover when the source is temporarily unavailable */ }
  return <LivePreview initialData={data} />
}
