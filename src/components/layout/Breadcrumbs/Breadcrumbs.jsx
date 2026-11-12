import { Link, useLocation } from 'react-router-dom'

const labels = {
  'control-center': 'Início',
  incidents: 'Ocorrências',
  new: 'Nova ocorrência',
  resolution: 'Resolução',
  equipment: 'Elevadores atendidos',
  areas: 'Áreas',
  technicians: 'Técnicos',
  'operations-map': 'Mapa operacional',
  analytics: 'Indicadores',
  audit: 'Auditoria',
  reports: 'Relatórios',
  settings: 'Configurações',
}
function segmentLabel(segment, previous) {
  if (labels[segment]) return labels[segment]
  if (previous === 'incidents') return `Ocorrência ${segment}`
  if (previous === 'equipment') return `Elevador ${segment}`
  if (previous === 'areas') return `Área ${segment}`
  if (previous === 'technicians') return `Técnico ${segment}`
  return segment
}
function Breadcrumbs() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)
  const crumbs = segments.map((segment, index) => ({
    label: segmentLabel(segment, segments[index - 1]),
    to: `/${segments.slice(0, index + 1).join('/')}`,
  }))
  if (!crumbs.length || crumbs[0].to !== '/control-center')
    crumbs.unshift({ label: 'Início', to: '/control-center' })
  return (
    <nav className="breadcrumbs" aria-label="Caminho de navegação">
      <ol>
        {crumbs.map((crumb, index) => (
          <li key={crumb.to}>
            {index > 0 && <span aria-hidden="true">/</span>}
            {index === crumbs.length - 1 ? (
              <span aria-current="page">{crumb.label}</span>
            ) : (
              <Link to={crumb.to}>{crumb.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
export default Breadcrumbs
