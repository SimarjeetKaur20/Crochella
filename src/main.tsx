import { StrictMode, Component, ErrorInfo, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Crochella] Runtime error:', error, info)
  }
  render() {
    if (this.state.error) {
      const err = this.state.error as Error
      return (
        <div style={{
          minHeight:'100vh', display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', background:'#FFF9F2',
          fontFamily:'Inter,sans-serif', padding:'2rem', textAlign:'center',
        }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🧶</div>
          <h2 style={{ color:'#493B35', marginBottom:'0.5rem' }}>Something went wrong</h2>
          <p style={{ color:'#E57373', fontFamily:'monospace', fontSize:'0.85rem', marginBottom:'1.5rem' }}>
            {err.message}
          </p>
          <button onClick={() => { localStorage.clear(); window.location.reload() }}
            style={{ padding:'0.75rem 2rem', borderRadius:'9999px', background:'#493B35',
              color:'white', border:'none', cursor:'pointer', fontWeight:600 }}>
            Clear Cache &amp; Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
