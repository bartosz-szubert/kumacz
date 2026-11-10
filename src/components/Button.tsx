import type { ComponentProps } from 'react'

type ButtonProps = ComponentProps<'button'> & {
  tone?: 'primary' | 'secondary'
}

export function Button({ tone = 'primary', type = 'button', className = '', ...props }: ButtonProps) {
  return <button {...props} type={type} className={`ui-button ui-button--${tone} ${className}`.trim()} />
}
