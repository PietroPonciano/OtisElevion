import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Add01Icon,
  Menu01Icon,
  Notification01Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons'
import { useCurrentUser } from '../../../hooks/useCurrentUser'
import { useNotifications } from '../../../hooks/useNotifications'
import { useIncidents } from '../../../hooks/useIncidents'
import { useEquipment } from '../../../hooks/useEquipment'
import { useBuildings } from '../../../hooks/useBuildings'
import Drawer from '../../ui/Drawer/Drawer'

const titles = {
  '/control-center': 'Centro de Controle',
  '/incidents': 'Ocorrências',
  '/incidents/new': 'Nova ocorrência',
  '/equipment': 'Equipamentos',
  '/areas': 'Áreas',
  '/technicians': 'Técnicos',
  '/operations-map': 'Mapa de Operações',
  '/analytics': 'Indicadores',
  '/audit': 'Auditoria',
  '/reports': 'Relatórios',
  '/settings': 'Configurações',
}

function Header({ onMenuClick }) {
  const { pathname } = useLocation()
  const { user } = useCurrentUser()
  const { notifications, unreadCount, markRead } = useNotifications()
  const { incidents } = useIncidents()
  const { equipment } = useEquipment()
  const { buildings } = useBuildings()

  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const searchRef = useRef(null)
  const title = titles[pathname] || 'OTIS Flow'

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }

      if (event.key === 'Escape') {
        setQuery('')
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()

    if (!term) return []

    return [
      ...incidents
        .filter((item) =>
          `${item.id} ${item.description}`.toLowerCase().includes(term),
        )
        .map((item) => ({
          id: item.id,
          label: item.id,
          detail: item.description,
          to: `/incidents/${item.id}`,
        })),

      ...equipment
        .filter((item) =>
          `${item.id} ${item.code} ${item.model}`.toLowerCase().includes(term),
        )
        .map((item) => ({
          id: item.id,
          label: item.id,
          detail: `${item.code} · ${item.model}`,
          to: `/equipment/${item.id}`,
        })),

      ...buildings
        .filter((item) =>
          item.name.toLowerCase().includes(term),
        )
        .map((item) => ({
          id: item.id,
          label: item.name,
          detail: item.address,
          to: `/areas/${item.areaId}`,
        })),
    ].slice(0, 6)
  }, [buildings, equipment, incidents, query])

  return (
    <>
      <header className="app-header">
        <button
          type="button"
          className="icon-button menu-button"
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <HugeiconsIcon
            icon={Menu01Icon}
            size={23}
            strokeWidth={2}
          />
        </button>

        <div className="header-context">
          <p>Operações</p>
          <strong>{title}</strong>
        </div>

        <div className="header-tools">
          <div className="search-wrapper">
            <label className="global-search">
              <HugeiconsIcon
                icon={Search01Icon}
                size={18}
                strokeWidth={2}
              />

              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar no sistema"
                aria-label="Buscar no sistema"
              />

              <kbd>Ctrl K</kbd>
            </label>

            {query && (
              <div className="search-results">
                {results.length ? (
                  results.map((result) => (
                    <Link
                      key={`${result.id}-${result.to}`}
                      to={result.to}
                      onClick={() => setQuery('')}
                    >
                      <strong>{result.label}</strong>
                      <span>{result.detail}</span>
                    </Link>
                  ))
                ) : (
                  <p>Nenhum resultado encontrado.</p>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={() => setNotificationsOpen(true)}
            aria-label="Notificações"
          >
            <HugeiconsIcon
              icon={Notification01Icon}
              size={21}
              strokeWidth={2}
            />

            {unreadCount > 0 && (
              <span className="notification-count">
                {unreadCount}
              </span>
            )}
          </button>

          <Link className="header-new" to="/incidents/new">
            <HugeiconsIcon
              icon={Add01Icon}
              size={18}
              strokeWidth={2}
            />
            <span>Nova ocorrência</span>
          </Link>

          <button
            type="button"
            className="profile"
            aria-label={`Perfil de ${user.name}, ${user.role}`}
          >
            {user.initials}
          </button>
        </div>
      </header>

      <Drawer
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        title="Notificações"
      >
        <div className="notification-list">
          {notifications.length ? (
            notifications.map((notification) => (
              <Link
                key={notification.id}
                to={
                  notification.incidentId
                    ? `/incidents/${notification.incidentId}`
                    : '#'
                }
                className={`notification-item ${!notification.read ? 'unread' : ''
                  }`}
                onClick={() => {
                  markRead(notification.id)
                  setNotificationsOpen(false)
                }}
              >
                <strong>{notification.title}</strong>
                <span>{notification.message}</span>
                <small>
                  {notification.createdAt.replace('T', ' ').slice(0, 16)}
                </small>
              </Link>
            ))
          ) : (
            <p className="notification-empty">
              Não há notificações.
            </p>
          )}
        </div>
      </Drawer>
    </>
  )
}

export default Header