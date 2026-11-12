import { useEffect } from 'react'

function Drawer({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event) => event.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="ui-overlay" role="presentation" onMouseDown={onClose}>
      <aside
        className="ui-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <h2>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </header>
        {children}
      </aside>
    </div>
  )
}
export default Drawer
