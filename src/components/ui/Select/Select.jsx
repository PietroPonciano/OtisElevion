import { cn } from '../../../utils/cn'
function Select({ label, error, options = [], placeholder, className, ...props }) {
  return (
    <label className={cn('ui-field', className)}>
      {label && <span>{label}</span>}
      <select className="ui-input" aria-invalid={Boolean(error)} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <small className="ui-field__error">{error}</small>}
    </label>
  )
}
export default Select
