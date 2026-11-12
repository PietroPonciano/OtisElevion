import { cn } from '../../../utils/cn'
function Button({ children, className, variant = 'primary', type = 'button', ...props }) {
  return (
    <button type={type} className={cn('ui-button', `ui-button--${variant}`, className)} {...props}>
      {children}
    </button>
  )
}
export default Button
