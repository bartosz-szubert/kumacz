import { useId } from 'react'
import type { Theme } from '../domain/theme'

interface ThemeSelectorProps {
  theme: Theme
  onChange: (theme: Theme) => void
}

export function ThemeSelector({ theme, onChange }: ThemeSelectorProps) {
  const name = useId()
  return (
    <fieldset className="theme-selector">
      <legend>Motyw</legend>
      <div className="theme-options">
        {(['electric', 'neon'] as const).map(value => (
          <label className="theme-option" key={value}>
            <input type="radio" name={name} value={value} checked={theme === value} onChange={() => onChange(value)} />
            <span>{value === 'electric' ? 'Electric' : 'Neon'}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
