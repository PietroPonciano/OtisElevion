import { Link } from 'react-router-dom'

import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Card from '../../components/ui/Card/Card'
import { useTechnicians } from '../../hooks/useTechnicians'
import { categoryLabel } from '../../constants/incidentCategories'
import { technicianAvailabilityLabel } from '../../constants/technicianAvailability'

const distanceFormatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })

function Technicians() {
  const { technicians } = useTechnicians()

  return (
    <PageContainer
      title="Equipe de campo"
      description="Disponibilidade, especialidade e carga atual de quem atende."
    >
      <Card className="field-team-card">
        <div className="field-team-table-wrap">
          <table className="field-team-table">
            <thead>
              <tr>
                <th aria-label="Disponibilidade" className="field-team-table__status-col" />
                <th>Técnico</th>
                <th className="field-team-table__specialties-col">Especialidades</th>
                <th className="num">Experiência</th>
                <th className="num">Carga</th>
                <th className="num">Distância</th>
                <th>Área</th>
              </tr>
            </thead>
            <tbody>
              {technicians.map((technician) => {
                const available = technician.availability === 'available'
                return (
                  <tr key={technician.id}>
                    <td>
                      <span
                        className={`status-dot ${available ? 'status-dot--available' : 'status-dot--busy'}`}
                        role="img"
                        aria-label={technicianAvailabilityLabel(technician.availability)}
                        title={technicianAvailabilityLabel(technician.availability)}
                      />
                    </td>
                    <td>
                      <Link className="text-action" to={`/technicians/${technician.id}`}>
                        {technician.name}
                      </Link>
                    </td>
                    <td>{technician.specialties.map(categoryLabel).join(', ')}</td>
                    <td className="num">{technician.experienceYears} anos</td>
                    <td className="num">{technician.workload}</td>
                    <td className="num">{distanceFormatter.format(technician.distanceKm)} km</td>
                    <td>{technician.areaId}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </PageContainer>
  )
}

export default Technicians
