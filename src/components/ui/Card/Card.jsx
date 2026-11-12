import { cn } from '../../../utils/cn'
function Card({ children, className, title, action }) {
  return (
    <section className={cn('ui-card', className)}>
      {(title || action) && (
        <header className="ui-card__header">
          {title && <h2>{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </section>
  )
}
export default Card
