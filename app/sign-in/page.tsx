'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LockKeyhole, ShieldCheck } from 'lucide-react'
import { signIn } from '@/lib/auth-client'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn.email({ email, password })
    setLoading(false)
    if (result.error) { setError('Email atau password tidak valid.'); return }
    router.push('/')
    router.refresh()
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#f7f7fb] px-5 text-[#20202b]">
    <section className="w-full max-w-[420px] rounded-3xl border border-[#e9e8f0] bg-white p-7 shadow-xl shadow-[#7057d9]/5 sm:p-9">
      <div className="mb-8 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7057d9] text-lg font-bold text-white">S</div><div><p className="font-bold">SMAZA<span className="text-[#7057d9]">16</span></p><p className="text-[10px] uppercase tracking-[.16em] text-[#9998a8]">Election portal</p></div></div>
      <div className="mb-7"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0edff] text-[#7057d9]"><LockKeyhole size={20}/></div><h1 className="text-2xl font-bold tracking-tight">Admin sign in</h1><p className="mt-2 text-sm leading-6 text-[#9291a0]">Masuk untuk mengakses statistik pemilihan OSIS.</p></div>
      <form onSubmit={submit} className="space-y-4"><label className="block text-xs font-semibold">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-[#e4e3eb] px-4 py-3 text-sm outline-none focus:border-[#7057d9]" placeholder="admin@example.com" /></label><label className="block text-xs font-semibold">Password<input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-[#e4e3eb] px-4 py-3 text-sm outline-none focus:border-[#7057d9]" placeholder="••••••••" /></label>{error && <p role="alert" className="text-xs font-medium text-[#d25d4e]">{error}</p>}<button disabled={loading} className="w-full rounded-xl bg-[#7057d9] py-3.5 text-sm font-semibold text-white transition hover:bg-[#6048c9] disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in securely'}</button></form>
      <div className="mt-7 flex items-center gap-2 border-t border-[#efedf3] pt-5 text-[11px] text-[#9998a8]"><ShieldCheck size={14} className="text-[#39a18d]"/>Protected administrator access</div>
    </section>
  </main>
}
