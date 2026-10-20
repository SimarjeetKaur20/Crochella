import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'crochella2024'

export default function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [useSupabase, setUseSupabase] = useState(false)

  const handlePasswordLogin = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('crochella-admin-auth', 'true')
      navigate('/admin')
    } else {
      setError('Incorrect password')
    }
  }

  const handleSupabaseLogin = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setError('')
    setLoading(true)
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authError) {
        setError(authError.message)
      } else {
        localStorage.setItem('crochella-admin-auth', 'true')
        navigate('/admin')
      }
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#FFF9F2' }}
    >
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm mb-8 hover:underline transition-colors"
          style={{ color: '#A8B5A0' }}
        >
          <ArrowLeft size={16} />
          Back to Store
        </Link>

        {/* Card */}
        <div
          className="rounded-2xl shadow-lg p-8"
          style={{ background: '#fff', border: '1px solid #E9DCCB' }}
        >
          {/* Logo / Title */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
              style={{ background: '#F5DDE3' }}
            >
              <Lock size={24} style={{ color: '#493B35' }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#2D211C' }}>
              Crochella
            </h1>
            <p className="text-sm mt-1 font-medium" style={{ color: '#A8B5A0' }}>
              Admin Login
            </p>
          </div>

          {/* Login type toggle — only if Supabase is configured */}
          {isSupabaseConfigured && (
            <div
              className="flex rounded-lg mb-6 overflow-hidden border"
              style={{ borderColor: '#E9DCCB' }}
            >
              <button
                type="button"
                onClick={() => { setUseSupabase(false); setError('') }}
                className="flex-1 py-2 text-sm font-medium transition-colors"
                style={{
                  background: !useSupabase ? '#F5DDE3' : 'transparent',
                  color: !useSupabase ? '#493B35' : '#A8B5A0',
                }}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => { setUseSupabase(true); setError('') }}
                className="flex-1 py-2 text-sm font-medium transition-colors"
                style={{
                  background: useSupabase ? '#F5DDE3' : 'transparent',
                  color: useSupabase ? '#493B35' : '#A8B5A0',
                }}
              >
                Supabase Login
              </button>
            </div>
          )}

          {/* Form */}
          {!useSupabase ? (
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: '#493B35' }}
                >
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    className="w-full px-4 py-3 pr-11 rounded-lg text-sm outline-none transition-all border"
                    style={{
                      background: '#FFF9F2',
                      borderColor: error ? '#ef4444' : '#E9DCCB',
                      color: '#2D211C',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#A8B5A0' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {error && (
                  <p className="text-sm mt-1.5 text-red-500">{error}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: '#493B35', color: '#FFF9F2' }}
              >
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleSupabaseLogin} className="space-y-5">
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: '#493B35' }}
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#A8B5A0' }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@crochella.com"
                    required
                    className="w-full pl-9 pr-4 py-3 rounded-lg text-sm outline-none transition-all border"
                    style={{
                      background: '#FFF9F2',
                      borderColor: '#E9DCCB',
                      color: '#2D211C',
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: '#493B35' }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full px-4 py-3 pr-11 rounded-lg text-sm outline-none transition-all border"
                    style={{
                      background: '#FFF9F2',
                      borderColor: error ? '#ef4444' : '#E9DCCB',
                      color: '#2D211C',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#A8B5A0' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {error && (
                  <p className="text-sm mt-1.5 text-red-500">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: '#493B35', color: '#FFF9F2' }}
              >
                {loading ? 'Logging in…' : 'Login with Supabase'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
