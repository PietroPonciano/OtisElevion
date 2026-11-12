import { useParams } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Card from '../../components/ui/Card/Card'
import EmptyState from '../../components/ui/EmptyState/EmptyState'
import { useTechnicians } from '../../hooks/useTechnicians'
import { categoryLabel } from '../../constants/incidentCategories'
import { technicianAvailabilityLabel } from '../../constants/technicianAvailability'
function TechnicianDetails() {
  const { id } = useParams()
  const { technicians } = useTechnicians()
  const technician = technicians.find((item) => item.id === id)
  if (!technician)
    return (
      <PageContainer title="Técnico">
        <EmptyState title="Técnico não encontrado" />
      </PageContainer>
    )
  return (
    <PageContainer
      title={technician.name}
      description={`${technician.id} · ${technicianAvailabilityLabel(technician.availability)}`}
    >
      <Card title="Perfil operacional">
        <p>
          <strong>Experiência:</strong> {technician.experienceYears} anos
        </p>
        <p>
          <strong>Carga atual:</strong> {technician.workload} atendimento(s)
        </p>
        <p>
          <strong>Especialidades:</strong> {technician.specialties.map(categoryLabel).join(', ')}
        </p>
        <p>
          <strong>Equipamentos conhecidos:</strong> {technician.equipmentIds.join(', ')}
        </p>
      </Card>
    </PageContainer>
  )
}
export default TechnicianDetails
