import { NavLink, useLocation } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Alert01Icon,
  Building01Icon,
  ChartLineData01Icon,
  Home01Icon,
  MapsIcon,
  Settings01Icon,
  UserGroupIcon,
  Cancel01Icon,
  Configuration01Icon,
} from '@hugeicons/core-free-icons'

const primaryItems = [
  {
    to: '/control-center',
    label: 'Visão geral',
    icon: Home01Icon,
  },
  {
    to: '/incidents',
    label: 'Ocorrências',
    icon: Alert01Icon,
  },
  {
    to: '/equipment',
    label: 'Equipamentos',
    icon: Building01Icon,
  },
  {
    to: '/technicians',
    label: 'Equipe',
    icon: UserGroupIcon,
  },
  {
    to: '/analytics',
    label: 'Indicadores',
    icon: ChartLineData01Icon,
  },
]

const moreItems = [
  { to: '/areas', label: 'Áreas', icon: MapsIcon },
  { to: '/operations-map', label: 'Mapa de operações', icon: MapsIcon },
]

const managementItems = [
  { to: '/audit', label: 'Auditoria', icon: Alert01Icon },
  { to: '/reports', label: 'Relatórios', icon: ChartLineData01Icon },
  { to: '/settings', label: 'Configurações', icon: Settings01Icon },
]

function NavigationLink({ item, onClose }) {
  return (
    <NavLink to={item.to} onClick={onClose}>
      <HugeiconsIcon icon={item.icon} size={20} strokeWidth={2} />
      <span>{item.label}</span>
    </NavLink>
  )
}

function Sidebar({ open, onClose }) {
  const { pathname } = useLocation()
  const moreIsActive = moreItems.some(({ to }) => pathname.startsWith(to))
  const managementIsActive = managementItems.some(({ to }) => pathname.startsWith(to))

  return (
    <>
      {open && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={onClose}
          aria-label="Fechar menu"
        />
      )}
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
      <div className="sidebar-header">
        <NavLink className="brand" to="/control-center" onClick={onClose}>
          <span className="brand-mark">
            <HugeiconsIcon
              icon={Configuration01Icon}
              size={22}
              strokeWidth={2}
            />
          </span>

          <span>
            OTIS <strong>ELEVION</strong>
          </span>
        </NavLink>

        <button
          type="button"
          className="sidebar-close"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <HugeiconsIcon
            icon={Cancel01Icon}
            size={22}
            strokeWidth={2}
          />
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Navegação principal">
        <p className="nav-label">Principal</p>

        {primaryItems.map((item) => (
          <NavigationLink key={item.to} item={item} onClose={onClose} />
        ))}

        <details className="nav-disclosure" open={moreIsActive || undefined}>
          <summary>Mais opções</summary>
          <div>
            {moreItems.map((item) => (
              <NavigationLink key={item.to} item={item} onClose={onClose} />
            ))}
          </div>
        </details>

        <details className="nav-disclosure" open={managementIsActive || undefined}>
          <summary>Gestão</summary>
          <div>
            {managementItems.map((item) => (
              <NavigationLink key={item.to} item={item} onClose={onClose} />
            ))}
          </div>
        </details>
      </nav>
      </aside>
    </>
  )
}

export default Sidebar
