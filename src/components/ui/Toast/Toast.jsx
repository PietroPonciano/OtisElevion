function Toast({ message, tone = 'success', onDismiss }) {
  if (!message) return null
  return (
    <div className={`ui-toast ui-toast--${tone}`} role="status">
      {message}
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Fechar notificação">
          ×
        </button>
      )}
    </div>
  )
}
export default Toast
