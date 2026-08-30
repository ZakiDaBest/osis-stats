import LivePreview from '@/components/live-preview'

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxOWGpev50hGcBHssVfKpjtT-4GD9uU2gli0Kgwump-TlFoSYXRuynn4rouGL0dPJa6IQ/exec'

export const dynamic = 'force-dynamic'

export default async function LivePreviewPage() {
  let data = { candidates: [], votes: [], totalVoters: 0, sessionStatus: 'unknown' }
  try {
    const response = await fetch(`${SCRIPT_URL}?action=getDashboardData`, { cache: 'no-store' })
    const json = await response.json()
    if (json.result === 'success') data = json
  } catch { /* client refresh can recover when the source is temporarily unavailable */ }
  return <LivePreview initialData={data} />
}
