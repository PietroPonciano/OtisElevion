import { Link } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Card from '../../components/ui/Card/Card'
import { useAreas } from '../../hooks/useAreas'
import { useBuildings } from '../../hooks/useBuildings'
import { useIncidents } from '../../hooks/useIncidents'
import { useEquipment } from '../../hooks/useEquipment'
function Areas() {
  const { areas } = useAreas()
  const { buildings } = useBuildings()
  const { equipment } = useEquipment()
  const { incidents } = useIncidents()
  return (
    <PageContainer
      title="Áreas operacionais"
      description="Volume, risco e capacidade por cobertura territorial, dados demonstrativos."
    >
      <div className="entity-grid">
        {areas.map((area) => {
          const ids = buildings.filter((item) => item.areaId === area.id).map((item) => item.id)
          const areaIncidents = incidents.filter((item) => ids.includes(item.buildingId))
          const critical = areaIncidents.filter((item) => item.priority === 'critical').length
          const recurrent = equipment
            .filter((item) => ids.includes(item.buildingId))
            .filter(
              (item) =>
                areaIncidents.filter((incident) => incident.equipmentId === item.id).length >= 2
            ).length
          return (
            <Card key={area.id}>
              <p className="eyebrow">{area.id}</p>
              <h2>{area.name}</h2>
              <p>{area.coverage}</p>
              <div className="area-stat-grid">
                <span>
                  <b>{areaIncidents.length}</b> ocorrências
                </span>
                <span>
                  <b>{critical}</b> críticas
                </span>
                <span>
                  <b>{recurrent}</b> recorrentes
                </span>
                <span>
                  <b>{area.technicianIds.length}</b> técnicos
                </span>
              </div>
              <p className="area-sla">
                SLA demonstrativo: <strong>{Math.max(76, 96 - critical * 3)}%</strong>
              </p>
              <Link className="text-action" to={`/areas/${area.id}`}>
                Abrir visão operacional
              </Link>
            </Card>
          )
        })}
      </div>
    </PageContainer>
  )
}
export default Areas
