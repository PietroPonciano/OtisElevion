import { useState } from 'react'
import { useParams } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Card from '../../components/ui/Card/Card'
import EmptyState from '../../components/ui/EmptyState/EmptyState'
import Skeleton from '../../components/ui/Skeleton/Skeleton'
import ErrorState from '../../components/ui/ErrorState/ErrorState'
import { useEquipment } from '../../hooks/useEquipment'
import { useEquipmentHistory } from '../../hooks/useEquipmentHistory'
import { useEquipmentActivity } from '../../hooks/useEquipmentActivity'
import { categoryLabel } from '../../constants/incidentCategories'
import { equipmentCategoryLabel } from '../../constants/equipmentCategory'
import { equipmentStatusLabel } from '../../constants/equipmentStatus'
import Button from '../../components/ui/Button/Button'
import { HugeiconsIcon } from '@hugeicons/react'
import { SearchAlertIcon } from '@hugeicons/core-free-icons'

function EquipmentDetails() {
  const { id } = useParams()
  const { equipment, loading: equipmentLoading, error: equipmentError } = useEquipment(id)
  const { history } = useEquipmentHistory(id)
  const { activity, loading: activityLoading, error: activityError } = useEquipmentActivity(id)
  const [showAll, setShowAll] = useState(false)

  if (equipmentLoading || activityLoading)
    return (
      <PageContainer title="Equipamento">
        <Skeleton height="4.5rem" />
        <Skeleton height="8rem" />
      </PageContainer>
    )
  if (equipmentError || activityError)
    return (
      <PageContainer title="Equipamento">
        <ErrorState description="Não foi possível carregar os dados do equipamento." />
      </PageContainer>
    )
  if (!equipment)
    return (
      <PageContainer title="Equipamento">
        <EmptyState title="Equipamento não encontrado" />
      </PageContainer>
    )

  return (
    <PageContainer
      title={equipment.id}
      description={`${equipmentCategoryLabel(equipment.category)} · ${equipment.model} · ${equipment.type}`}
    >
      <div className="detail-grid">
        <Card title="Condição operacional">
          <p>
            <strong>Categoria:</strong> {equipmentCategoryLabel(equipment.category)}
          </p>
          <p>
            <strong>Status:</strong> {equipmentStatusLabel(equipment.status)}
          </p>
          <p>
            <strong>Última manutenção:</strong> {equipment.lastMaintenance}
          </p>
          <p>
            <strong>Andares:</strong> {equipment.floors}
          </p>
        </Card>
        <Card title="Histórico de ocorrências">
          {activity.isRecurrent && (
            <div className="recurrence-banner">
              <p className="recurrence-banner__title">          
                <HugeiconsIcon
                icon={SearchAlertIcon}
                size={18}
              /> Recorrência identificada</p>
              <p>
                {activity.recentCount} ocorrência(s) semelhante(s) nos últimos{' '}
                {activity.windowDays} dias.
              </p>
            </div>
          )}
          {activity.total > 0 ? (
            <>
              <div className="info-list">
                <p>
                  <strong>Problema mais frequente:</strong> {categoryLabel(activity.topCategory)}{' '}
                  ({activity.topCategoryCount}x)
                </p>
                <p>
                  <strong>Última ocorrência:</strong>{' '}
                  {activity.lastOccurrence ? activity.lastOccurrence.slice(0, 10) : 'Não informado'}
                </p>
              </div>
              <Button
                type="button"
                className="text-action"
                onClick={() => setShowAll((current) => !current)}
              >
                {showAll ? 'Ocultar ocorrências relacionadas' : 'Ver ocorrências relacionadas'}
              </Button>
              {showAll && (
                <ul className="plan-list">
                  {activity.related.map((item) => (
                    <li key={item.id}>
                      {item.createdAt?.slice(0, 10)} · {categoryLabel(item.category)} ·{' '}
                      {item.summary}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p>Sem ocorrências históricas.</p>
          )}
          {history.length > 0 && (
            <p className="simulation-note">
              {history.length} ocorrência(s) já resolvida(s) alimentam o aprendizado deste
              equipamento.
            </p>
          )}
        </Card>
      </div>
    </PageContainer>
  )
}
export default EquipmentDetails
