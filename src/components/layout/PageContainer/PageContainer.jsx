import Breadcrumbs from '../Breadcrumbs/Breadcrumbs'
function PageContainer({ title, description, actions, children }) {
  return (
    <main className="page-container">
      <Breadcrumbs />
      <section className="page-heading">
        <div>
          <p className="eyebrow">OTIS OPS</p>
          <h1>{title}</h1>
          {description && <p className="page-description">{description}</p>}
        </div>
        {actions && <div className="page-actions">{actions}</div>}
      </section>
      {children}
    </main>
  )
}
export default PageContainer
