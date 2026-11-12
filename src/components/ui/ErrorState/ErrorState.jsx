function ErrorState({
  title = 'Não foi possível carregar os dados',
  description = 'Tente novamente em alguns instantes.',
  action,
}) {
  return (
    <section className="ui-state ui-state--error" role="alert">
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </section>
  )
}
export default ErrorState
