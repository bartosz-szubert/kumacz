import type { ReactNode } from 'react'
import type { Theme } from '../domain/theme'

interface AppShellProps {
  theme: Theme
  actions?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

export function AppShell({ theme, actions, children, footer }: AppShellProps) {
  return (
    <div className="app-shell" data-theme={theme}>
      <a className="skip-link" href="#main-content">Przejdź do treści</a>
      <p className="build-notice">Wersja testowa — aplikacja w budowie</p>
      <div className="app-frame">
        <header className="app-header">
          <p className="app-brand"><span className="brand-mark" aria-hidden="true">ku</span>Kumacz</p>
          {actions}
        </header>
        <main id="main-content" tabIndex={-1}>{children}</main>
        {footer && <footer className="app-footer">{footer}</footer>}
      </div>
    </div>
  )
}
