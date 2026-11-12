import { Link } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Add01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons'
import PageContainer from './PageContainer'

function ModulePlaceholder({
  title,
  description,
  actionLabel,
  actionTo,
}) {
  const action =
    actionLabel && actionTo ? (
      <Link className="primary-action" to={actionTo}>
        <HugeiconsIcon
          icon={Add01Icon}
          size={18}
          strokeWidth={2}
        />
        {actionLabel}
      </Link>
    ) : null

  return (
    <PageContainer
      title={title}
      description={description}
      actions={action}
    >
      <section className="module-placeholder">
        <div className="placeholder-signal">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div>
          <p className="status-label">Módulo preparado</p>

          <h2>Base operacional configurada</h2>

          <p>
            Este módulo já está conectado à navegação e receberá dados e
            regras nas próximas etapas.
          </p>

          <Link className="text-action" to="/control-center">
            Ir para o Centro de Controle
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={17}
              strokeWidth={2}
            />
          </Link>
        </div>
      </section>
    </PageContainer>
  )
}

export default ModulePlaceholder