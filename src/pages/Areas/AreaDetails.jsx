import { useParams } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Card from '../../components/ui/Card/Card'
import EmptyState from '../../components/ui/EmptyState/EmptyState'
import { useAreas } from '../../hooks/useAreas'
import { useBuildings } from '../../hooks/useBuildings'
import { useIncidents } from '../../hooks/useIncidents'
import { useEquipment } from '../../hooks/useEquipment'
function AreaDetails() {
  const { id } = useParams()
  const { areas } = useAreas()
  const { buildings } = useBuildings()
  const { incidents } = useIncidents()
  const { equipment } = useEquipment()
  const area = areas.find((item) => item.id === id)
  if (!area)
    return (
      <PageContainer title="Área">
        <EmptyState title="Área não encontrada" />
      </PageContainer>
    )
  const areaBuildings = buildings.filter((item) => item.areaId === id)
  const buildingIds = areaBuildings.map((item) => item.id)
  const areaIncidents = incidents.filter((item) => buildingIds.includes(item.buildingId))
  const problematic = equipment
    .filter((item) => buildingIds.includes(item.buildingId))
    .map((item) => ({
      ...item,
      count: areaIncidents.filter((incident) => incident.equipmentId === item.id).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  return (
    <PageContainer
      title={area.name}
      description={`Supervisão: ${area.supervisor} · dados demonstrativos`}
    >
      <section className="metric-grid">
        {[
          { label: 'Ocorrências', value: areaIncidents.length },
          {
            label: 'Críticas',
            value: areaIncidents.filter((item) => item.priority === 'critical').length,
          },
          { label: 'Equipamentos', value: problematic.length },
          { label: 'Técnicos', value: area.technicianIds.length },
        ].map((metric) => (
          <article className="metric-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>
      <div className="area-detail-grid">
        <Card title="Equipamentos com maior recorrência">
          <div className="recurrence-list">
            {problematic.map((item) => (
              <div key={item.id}>
                <strong>{item.id}</strong>
                <span>{item.count} ocorrência(s)</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Edifícios atendidos">
          <ul className="plan-list">
            {areaBuildings.map((building) => (
              <li key={building.id}>
                {building.name} · {building.address}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </PageContainer>
  )
}
export default AreaDetails
