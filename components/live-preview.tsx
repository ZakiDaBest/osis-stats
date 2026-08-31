'use client'

import { useEffect, useMemo, useState } from 'react'
import { Maximize2, RefreshCw, Radio, Trophy } from 'lucide-react'
import { fetchDashboardData } from '@/lib/google-script'

type Candidate = { name?: string; nama?: string; namaKetua?: string; namaWakil?: string; photoKetua?: string; photoWakil?: string; image?: string; foto?: string; photo?: string; votes?: number; color?: string }
type Data = { candidates?: Candidate[]; votes?: Array<{ candidateName?: string; candidate?: string }>; totalVoters?: number; sessionStatus?: string }

const colors = ['#7657e8', '#e27b58', '#2fa994', '#d4a13a']
const candidateImages = (candidate: Candidate) => [candidate.photoKetua || candidate.image || candidate.foto || candidate.photo || '', candidate.photoWakil || '']
const candidateName = (candidate: Candidate) => candidate.name || candidate.nama || `Paslon ${candidate.namaKetua || ''}`

export default function LivePreview({ initialData }: { initialData: Data }) {
  const [data, setData] = useState(initialData)
  const [updated, setUpdated] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const candidates = useMemo(() => {
    const counts = (data.votes || []).reduce<Record<string, number>>((acc, vote) => {
      const key = vote.candidateName || vote.candidate || ''
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
    return (data.candidates || []).map((candidate, index) => ({ ...candidate, label: candidateName(candidate), count: counts[candidateName(candidate)] ?? candidate.votes ?? 0, color: candidate.color || colors[index % colors.length] })).sort((a, b) => b.count - a.count)
  }, [data])
  const total = candidates.reduce((sum, candidate) => sum + candidate.count, 0)
  const refresh = async (signal?: AbortSignal) => {
    setLoading(true)
    try {
      const next = await fetchDashboardData(signal)
      if (next.result === 'success') setData((current: Data) => JSON.stringify(current) === JSON.stringify(next) ? current : next)
      setUpdated(new Date())
    } catch (error) {
      if ((error as Error).name !== 'AbortError') setUpdated(new Date())
    } finally { setLoading(false) }
  }
  useEffect(() => {
    const controller = new AbortController()
    let timer: number | undefined
    const schedule = () => { if (document.visibilityState === 'visible') timer = window.setTimeout(async () => { await refresh(controller.signal); schedule() }, 5000) }
    const onVisibilityChange = () => { if (document.visibilityState === 'visible') { void refresh(controller.signal); schedule() } else if (timer) window.clearTimeout(timer) }
    schedule()
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => { controller.abort(); if (timer) window.clearTimeout(timer); document.removeEventListener('visibilitychange', onVisibilityChange) }
  }, [])
  const goFullscreen = () => document.documentElement.requestFullscreen?.()
  return <main className="min-h-screen overflow-hidden bg-[#100d1f] text-white selection:bg-[#7657e8]">
    <header className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-10 lg:px-16">
      <div className="flex items-center gap-3"><img src="https://cdn.zakilabs.my.id/pemilos/logoosis.png" alt="Logo OSIS" className="h-11 w-11 object-contain" /><div><p className="text-sm font-bold tracking-wide">SMAZA<span className="text-[#a696ff]">16</span></p><p className="text-[10px] uppercase tracking-[.24em] text-white/45">Pemilihan Ketua OSIS</p></div></div>
      <div className="flex items-center gap-3"><span className="hidden text-xs text-white/45 sm:inline">Diperbarui {updated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span><button aria-label="Refresh data" onClick={refresh} className="rounded-xl border border-white/10 p-2.5 text-white/60 transition hover:bg-white/10 hover:text-white"><RefreshCw size={17} className={loading ? 'animate-spin' : ''}/></button><button aria-label="Fullscreen" onClick={goFullscreen} className="hidden rounded-xl border border-white/10 p-2.5 text-white/60 transition hover:bg-white/10 hover:text-white sm:block"><Maximize2 size={17}/></button></div>
    </header>
    <section className="mx-auto max-w-[1500px] px-6 py-10 sm:px-10 lg:px-16 lg:py-14"><div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-[#a696ff]"><Radio size={14} className="animate-pulse"/> Live</div><h1 className="flex max-w-[1100px] flex-wrap items-baseline gap-x-3 gap-y-1 text-4xl font-black tracking-tight sm:text-6xl"><span>Live Count</span><span className="text-white/45">Pemilihan Ketua & Wakil OSIS</span></h1></div><div className={`rounded-2xl border px-5 py-4 ${data.sessionStatus === 'open' ? 'border-white/10 bg-white/[.06]' : 'border-[#ff6b6b]/40 bg-[#ff6b6b]/10'}`}><p className={`text-xs ${data.sessionStatus === 'open' ? 'text-white/45' : 'text-[#ff9a9a]'}`}>Total suara masuk</p><p className="mt-1 text-3xl font-black">{total.toLocaleString('id-ID')}</p><p className={`mt-1 text-xs ${data.sessionStatus === 'open' ? 'text-[#55d0b7]' : 'text-[#ff6b6b]'}`}>{data.sessionStatus === 'open' ? 'Voting sedang berlangsung' : 'Sesi voting ditutup'}</p></div></div>
      <div className="grid gap-5 md:grid-cols-2">{candidates.map((candidate, index) => { const percent = total ? (candidate.count / total) * 100 : 0; const [ketuaImage, wakilImage] = candidateImages(candidate); return <article key={candidate.label} className={`relative overflow-hidden rounded-[28px] border p-5 transition ${index === 0 ? 'border-[#7657e8]/70 bg-[#211a42]' : 'border-white/10 bg-white/[.06]'}`}><div className="flex items-center gap-5"><div className="relative flex h-28 w-32 shrink-0 items-end justify-center gap-2"><div className="h-24 w-20 overflow-hidden rounded-2xl border border-white/10 bg-white/10">{ketuaImage ? <img src={ketuaImage} alt={`Foto ${candidate.namaKetua || candidate.label}`} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none' }}/> : <div className="flex h-full items-center justify-center text-2xl font-black text-white/25">{(candidate.namaKetua || candidate.label).charAt(0)}</div>}</div><div className="h-24 w-20 overflow-hidden rounded-2xl border-2 border-[#100d1f] bg-white/10 shadow-lg shadow-black/20">{wakilImage ? <img src={wakilImage} alt={`Foto ${candidate.namaWakil || 'Wakil calon'}`} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none' }}/> : <div className="flex h-full items-center justify-center text-2xl font-black text-white/25">{(candidate.namaWakil || 'W').charAt(0)}</div>}</div><span className="absolute left-2 top-2 rounded-lg bg-black/40 px-2 py-1 text-[10px] font-bold">#{index + 1}</span></div><div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-[.18em]" style={{ color: candidate.color }}>Pasangan calon</p><h2 className="mt-2 truncate text-xl font-black sm:text-2xl">{candidate.label}</h2><p className="mt-1 truncate text-sm text-white/50">{candidate.namaKetua}{candidate.namaWakil ? ` & ${candidate.namaWakil}` : ''}</p></div><div className="text-right"><p className="text-3xl font-black">{candidate.count.toLocaleString('id-ID')}</p><p className="text-xs text-white/45">suara</p></div></div><div className="mt-6"><div className="mb-2 flex justify-between text-xs text-white/45"><span>Perolehan suara</span><strong className="text-white">{percent.toFixed(1)}%</strong></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${percent}%`, backgroundColor: candidate.color }}/></div></div>{index === 0 && <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full bg-[#7657e8] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider"><Trophy size={12}/> Unggul</div>}</article> })}</div>
      {candidates.length === 0 && <div className="rounded-3xl border border-dashed border-white/15 py-20 text-center text-white/45">Menunggu data hasil pemilihan...</div>}
      <footer className="mt-10 flex justify-between text-xs text-white/30"><span>Data diperbarui otomatis setiap 5 detik</span><span>SMA Islam Al Azhar 16</span></footer>
    </section>
  </main>
}
