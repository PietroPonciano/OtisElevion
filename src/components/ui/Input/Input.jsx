import { cn } from '../../../utils/cn'
function Input({ label, error, id, className, ...props }) {
  const inputProps = props.value === null ? { ...props, value: '' } : props
  const inputId = id || inputProps.name
  return (
    <label className={cn('ui-field', className)}>
      {label && <span>{label}</span>}
      <input id={inputId} className="ui-input" aria-invalid={Boolean(error)} {...inputProps} />
      {error && <small className="ui-field__error">{error}</small>}
    </label>
  )
}
export default Input
