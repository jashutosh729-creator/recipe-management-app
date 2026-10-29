import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import './index.css'

class AppErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    console.error('RecipeBook render error:', error)
  }

  render() {
    if (this.state.error) {
      return <main style={{ maxWidth: 680, margin: '12vh auto', padding: 32, color: '#244333', fontFamily: 'system-ui, sans-serif' }}>
        <p style={{ color: '#d96742', fontWeight: 700 }}>RECIPEBOOK</p>
        <h1>We couldn’t load the recipe page.</h1>
        <p>Refresh the page. If it keeps happening, check the browser console for this error:</p>
        <pre style={{ whiteSpace: 'pre-wrap', padding: 16, background: '#f3f1eb', borderRadius: 8 }}>{this.state.error.message}</pre>
      </main>
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppErrorBoundary><App /></AppErrorBoundary>
  </StrictMode>,
)
