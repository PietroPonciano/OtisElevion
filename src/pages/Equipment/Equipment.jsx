import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Card from '../../components/ui/Card/Card'
import Badge from '../../components/ui/Badge/Badge'

import { useEquipment } from '../../hooks/useEquipment'
import { useBuildings } from '../../hooks/useBuildings'
import { priorityLabel } from '../../constants/priority'
import { equipmentCategoryLabel } from '../../constants/equipmentCategory'
import { equipmentStatusLabel } from '../../constants/equipmentStatus'

function Equipment() {
  const { equipment } = useEquipment()
  const { buildings } = useBuildings()

  const [category, setCategory] = useState('all')

  const categoryFilters = useMemo(() => {
    const categories = [
      ...new Set(
        equipment
          .map((item) => item.category)
          .filter(Boolean)
      ),
    ]

    return [
      {
        value: 'all',
        label: 'Todos',
      },
      ...categories.map((value) => ({
        value,
        label: equipmentCategoryLabel(value),
      })),
    ]
  }, [equipment])

  const filtered = useMemo(() => {
    if (category === 'all') {
      return equipment
    }

    return equipment.filter(
      (item) => item.category === category
    )
  }, [equipment, category])

  return (
    <PageContainer
      title="Equipamentos"
      description="Base instalada, condição atual e criticidade operacional."
      actions={
        <div className="period-switch">
          {categoryFilters.map((option) => (
            <button
              key={option.value}
              type="button"
              className={
                option.value === category
                  ? 'active'
                  : ''
              }
              aria-pressed={option.value === category}
              onClick={() =>
                setCategory(option.value)
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="entity-grid">
        {filtered.map((item) => {
          const building = buildings.find(
            (building) =>
              building.id === item.buildingId
          )

          return (
            <Card key={item.id}>
              <div className="entity-top">
                <strong>{item.id}</strong>

                <Badge
                  tone={
                    item.criticality === 'critical'
                      ? 'critical'
                      : item.criticality === 'high'
                        ? 'high'
                        : 'neutral'
                  }
                >
                  {priorityLabel(
                    item.criticality
                  )}
                </Badge>
              </div>

              <h2>
                {item.code} · {item.model}
              </h2>

              <p>
                <Badge tone="neutral">
                  {equipmentCategoryLabel(
                    item.category
                  )}
                </Badge>{' '}
                {item.type}
              </p>

              <p>
                {building?.name ||
                  'Local não informado'}
              </p>

              <p>
                Status:{' '}
                <strong>{equipmentStatusLabel(item.status)}</strong>
              </p>

              <Link
                className="text-action"
                to={`/equipment/${item.id}`}
              >
                Ver histórico
              </Link>
            </Card>
          )
        })}
      </div>
    </PageContainer>
  )
}

export default Equipment
