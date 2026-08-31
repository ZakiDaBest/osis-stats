export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxOWGpev50hGcBHssVfKpjtT-4GD9uU2gli0Kgwump-TlFoSYXRuynn4rouGL0dPJa6IQ/exec'

export async function fetchDashboardData(signal?: AbortSignal) {
  const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getDashboardData`, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Google macro request failed with status ${response.status}`)
  }

  return response.json()
}
