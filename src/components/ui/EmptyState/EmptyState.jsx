function EmptyState({ title = 'Nenhum item encontrado', description, action }) {
  return (
    <section className="ui-state">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {action}
    </section>
  )
}
export default EmptyState
