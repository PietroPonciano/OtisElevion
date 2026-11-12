import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import PageContainer from '../../components/layout/PageContainer/PageContainer'
import Tabs from '../../components/ui/Tabs/Tabs'
import Badge from '../../components/ui/Badge/Badge'
import { useIncidents } from '../../hooks/useIncidents'
import { useBuildings } from '../../hooks/useBuildings'
import { useEquipment } from '../../hooks/useEquipment'
import { useTechnicians } from '../../hooks/useTechnicians'
import { getSlaStatus } from '../../utils/sla'
import { priorityLabel } from '../../constants/priority'
import { categoryLabel } from '../../constants/incidentCategories'
import { equipmentStatusLabel } from '../../constants/equipmentStatus'

const layers = [
  { id: 'incidents', label: 'Ocorrências' },
  { id: 'technicians', label: 'Técnicos' },
  { id: 'equipment', label: 'Equipamentos' },
]

function coordinateKey(coordinates) {
  if (
    !coordinates ||
    !Number.isFinite(coordinates.lat) ||
    !Number.isFinite(coordinates.lng)
  ) {
    return 'unknown'
  }

  return `${coordinates.lat.toFixed(6)}:${coordinates.lng.toFixed(6)}`
}

function getPointOffset(index, total) {
  if (total <= 1) {
    return { x: 0, y: 0 }
  }

  const radius = total <= 3 ? 16 : 22
  const angle =
    -Math.PI / 2 +
    (index / total) * Math.PI * 2

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  }
}

function useCoordinateProjector(buildings) {
  // O projetor é intencionalmente uma closure memoizada sobre os limites calculados do mapa.
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  return useMemo(() => {
    const coordinates = buildings
      .map((building) => building.coordinates)
      .filter(
        (coordinate) =>
          coordinate &&
          Number.isFinite(coordinate.lat) &&
          Number.isFinite(coordinate.lng)
      )

    if (!coordinates.length) {
      return () => ({
        left: '50%',
        top: '50%',
      })
    }

    const lats = coordinates.map(
      (coordinate) => coordinate.lat
    )

    const lngs = coordinates.map(
      (coordinate) => coordinate.lng
    )

    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)

    const latSpan = maxLat - minLat || 1
    const lngSpan = maxLng - minLng || 1

    /*
     * Usa o maior eixo para preservar a proporção
     * espacial dos prédios.
     */
    const maxSpan = Math.max(
      latSpan,
      lngSpan
    )

    const padding = 10
    const available = 100 - padding * 2

    return (coordinate) => {
      if (
        !coordinate ||
        !Number.isFinite(coordinate.lat) ||
        !Number.isFinite(coordinate.lng)
      ) {
        return {
          left: '50%',
          top: '50%',
        }
      }

      const x =
        padding +
        ((coordinate.lng - minLng) /
          maxSpan) *
          available

      const y =
        padding +
        ((maxLat - coordinate.lat) /
          maxSpan) *
          available

      return {
        left: `${Math.min(95, Math.max(5, x))}%`,
        top: `${Math.min(95, Math.max(5, y))}%`,
      }
    }
  }, [buildings])
}

function OperationsMap() {
  const [layer, setLayer] = useState('incidents')
  const [selectedId, setSelectedId] = useState(null)

  const { incidents } = useIncidents()
  const { buildings } = useBuildings()
  const { equipment } = useEquipment()
  const { technicians } = useTechnicians()

  const project = useCoordinateProjector(buildings)

  const buildingsById = useMemo(
    () =>
      Object.fromEntries(
        buildings.map((building) => [
          building.id,
          building,
        ])
      ),
    [buildings]
  )

  /*
   * Centro de cada área para representar os técnicos.
   */
  const areaCoordinates = useMemo(() => {
    const groups = {}

    buildings.forEach((building) => {
      if (!building.coordinates) return

      if (!groups[building.areaId]) {
        groups[building.areaId] = []
      }

      groups[building.areaId].push(
        building.coordinates
      )
    })

    return Object.fromEntries(
      Object.entries(groups).map(
        ([areaId, coordinates]) => [
          areaId,
          {
            lat:
              coordinates.reduce(
                (sum, coordinate) =>
                  sum + coordinate.lat,
                0
              ) / coordinates.length,

            lng:
              coordinates.reduce(
                (sum, coordinate) =>
                  sum + coordinate.lng,
                0
              ) / coordinates.length,
          },
        ]
      )
    )
  }, [buildings])

  const activeIncidents = useMemo(
    () =>
      incidents.filter(
        (item) =>
          !['CLOSED', 'CANCELLED'].includes(
            item.status
          )
      ),
    [incidents]
  )

  const data =
    layer === 'incidents'
      ? activeIncidents
      : layer === 'technicians'
        ? technicians
        : equipment

  /*
   * Calcula a posição de cada ponto e agrupa
   * pontos que compartilham a mesma coordenada.
   */
  const positionedItems = useMemo(() => {
    const groups = {}

    data.forEach((item) => {
      let coordinates = null

      if (layer === 'incidents') {
        coordinates =
          buildingsById[item.buildingId]
            ?.coordinates || null
      }

      if (layer === 'equipment') {
        coordinates =
          buildingsById[item.buildingId]
            ?.coordinates || null
      }

      if (layer === 'technicians') {
        coordinates =
          areaCoordinates[item.areaId] || null
      }

      const key = coordinateKey(coordinates)

      if (!groups[key]) {
        groups[key] = []
      }

      groups[key].push(item)
    })

    return data.map((item) => {
      let coordinates = null

      if (layer === 'incidents') {
        coordinates =
          buildingsById[item.buildingId]
            ?.coordinates || null
      }

      if (layer === 'equipment') {
        coordinates =
          buildingsById[item.buildingId]
            ?.coordinates || null
      }

      if (layer === 'technicians') {
        coordinates =
          areaCoordinates[item.areaId] || null
      }

      const key = coordinateKey(coordinates)
      const group = groups[key] || []

      const index = group.findIndex(
        (groupItem) =>
          groupItem.id === item.id
      )

      return {
        item,
        coordinates,
        index,
        total: group.length,
      }
    })
  }, [
    data,
    layer,
    buildingsById,
    areaCoordinates,
  ])

  /*
   * Quando troca de camada, fecha a seleção anterior.
   */
  const handleLayerChange = (nextLayer) => {
    setLayer(nextLayer)
    setSelectedId(null)
  }

  /*
   * Clicar fora fecha o popup.
   */
  const handleMapClick = () => {
    setSelectedId(null)
  }

  const selectedItem =
    positionedItems.find(
      ({ item }) => item.id === selectedId
    ) || null

  return (
    <PageContainer
      title="Mapa operacional"
      description="Explore ocorrências, técnicos e equipamentos por localização. Clique em um ponto para consultar seus detalhes."
    >
      <Tabs
        tabs={layers}
        activeId={layer}
        onChange={handleLayerChange}
      />

      <section
        className="operations-map layered-map"
        onClick={handleMapClick}
      >
        <div className="map-gridlines" />

        {positionedItems.map(
          ({
            item,
            coordinates,
            index,
            total,
          }) => {
            const position =
              project(coordinates)

            const offset =
              getPointOffset(index, total)

            const isSelected =
              item.id === selectedId

            const style = {
              ...position,
              transform: `translate(
                calc(-50% + ${offset.x}px),
                calc(-50% + ${offset.y}px)
              )`,
              zIndex: isSelected ? 20 : 5,
            }

            /*
             * ======================================================
             * PONTO
             * ======================================================
             */
            return (
              <button
                key={item.id}
                type="button"
                className={`map-point ${
                  isSelected
                    ? 'map-point--selected'
                    : ''
                } ${
                  layer === 'incidents'
                    ? `map-point--${item.priority}`
                    : ''
                } ${
                  layer === 'technicians'
                    ? 'map-point--technician'
                    : ''
                } ${
                  layer === 'equipment'
                    ? 'map-point--equipment'
                    : ''
                }`}
                style={style}
                aria-label={`Ver informações de ${item.id || item.name}`}
                aria-expanded={isSelected}
                onClick={(event) => {
                  event.stopPropagation()

                  setSelectedId(
                    isSelected
                      ? null
                      : item.id
                  )
                }}
              >
                <span />
              </button>
            )
          }
        )}

        {selectedItem && (
          <MapInfoCard
            item={selectedItem.item}
            layer={layer}
            buildingsById={buildingsById}
            incidents={incidents}
            position={project(
              selectedItem.coordinates
            )}
            onClose={() =>
              setSelectedId(null)
            }
          />
        )}
      </section>

      <p className="simulation-note">
        Posições calculadas a partir das coordenadas
        cadastradas dos prédios. Técnicos são
        representados pelo centro de sua área de
        atendimento. Clique nos pontos para visualizar
        informações.
      </p>
    </PageContainer>
  )
}


function useMapPopoverPosition(
  pointPosition,
  isOpen
) {
  const cardRef = useRef(null)
  const [placement, setPlacement] = useState({
    side: 'top',
    style: {},
  })

  useEffect(() => {
    if (!isOpen || !cardRef.current) return

    const card = cardRef.current
    const map = card.closest('.operations-map')

    if (!map) return

    const mapRect = map.getBoundingClientRect()
    const cardRect = card.getBoundingClientRect()

    /*
     * Converte a posição percentual do ponto
     * para pixels dentro do mapa.
     */
    const pointX =
      (parseFloat(pointPosition.left) / 100) *
      mapRect.width

    const pointY =
      (parseFloat(pointPosition.top) / 100) *
      mapRect.height

    const GAP = 14
    const PADDING = 10

    const cardWidth = cardRect.width
    const cardHeight = cardRect.height

    /*
     * Espaço disponível em cada direção.
     */
    const spaceTop = pointY
    const spaceBottom =
      mapRect.height - pointY

    const spaceLeft = pointX
    const spaceRight =
      mapRect.width - pointX

    /*
     * Verifica se existe espaço suficiente
     * em cada direção.
     */
    const fitsTop =
      spaceTop >=
      cardHeight + GAP + PADDING

    const fitsBottom =
      spaceBottom >=
      cardHeight + GAP + PADDING

    const fitsRight =
      spaceRight >=
      cardWidth + GAP + PADDING

    const fitsLeft =
      spaceLeft >=
      cardWidth + GAP + PADDING

    /*
     * Preferência:
     *
     * 1. cima
     * 2. baixo
     * 3. direita
     * 4. esquerda
     */
    let side

    if (fitsTop) {
      side = 'top'
    } else if (fitsBottom) {
      side = 'bottom'
    } else if (fitsRight) {
      side = 'right'
    } else if (fitsLeft) {
      side = 'left'
    } else {
      /*
       * Se não houver espaço suficiente em nenhuma
       * direção, escolhemos a direção com mais espaço.
       */
      const spaces = {
        top: spaceTop,
        bottom: spaceBottom,
        right: spaceRight,
        left: spaceLeft,
      }

      side = Object.entries(spaces).sort(
        ([, a], [, b]) => b - a
      )[0][0]
    }

    /*
     * Posição inicial baseada na direção.
     */
    let left = pointX
    let top = pointY

    if (side === 'top') {
      top =
        pointY -
        cardHeight -
        GAP

      left =
        pointX -
        cardWidth / 2
    }

    if (side === 'bottom') {
      top =
        pointY +
        GAP

      left =
        pointX -
        cardWidth / 2
    }

    if (side === 'right') {
      top =
        pointY -
        cardHeight / 2

      left =
        pointX +
        GAP
    }

    if (side === 'left') {
      top =
        pointY -
        cardHeight / 2

      left =
        pointX -
        cardWidth -
        GAP
    }

    /*
     * Nunca deixa o card escapar do mapa.
     */
    left = Math.max(
      PADDING,
      Math.min(
        left,
        mapRect.width -
          cardWidth -
          PADDING
      )
    )

    top = Math.max(
      PADDING,
      Math.min(
        top,
        mapRect.height -
          cardHeight -
          PADDING
      )
    )

    setPlacement({
      side,
      style: {
        left: `${left}px`,
        top: `${top}px`,
      },
    })
  }, [pointPosition, isOpen])

  return {
    cardRef,
    ...placement,
  }
}



function MapInfoCard({
  item,
  layer,
  buildingsById,
  incidents,
  position,
  onClose,
}) {
  const {
    cardRef,
    side,
    style,
  } = useMapPopoverPosition(
    position,
    true
  )

  const building =
    buildingsById[item.buildingId]

  const cardClassName = `map-info-card map-info-card--${side}`

  /*
   * ============================================================
   * OCORRÊNCIA
   * ============================================================
   */
  if (layer === 'incidents') {
    const sla = getSlaStatus(item)

    return (
      <div
        ref={cardRef}
        className={cardClassName}
        style={style}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="map-info-card__close"
          onClick={onClose}
          aria-label="Fechar informações"
        >
          ×
        </button>

        <strong>{item.id}</strong>

        <small>
          {building?.name ||
            'Local não informado'}
        </small>

        <Badge tone={item.priority}>
          {priorityLabel(item.priority)}
        </Badge>

        <div className="map-info-card__meta">
          <span>
            SLA: {sla.label}
          </span>

          <span>
            {sla.formatted}
          </span>
        </div>
      </div>
    )
  }

  /*
   * ============================================================
   * TÉCNICO
   * ============================================================
   */
  if (layer === 'technicians') {
    const topSpecialty =
      item.specialties?.[0]

    return (
      <div
        ref={cardRef}
        className={cardClassName}
        style={style}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="map-info-card__close"
          onClick={onClose}
          aria-label="Fechar informações"
        >
          ×
        </button>

        <strong>{item.name}</strong>

        <small>
          {item.availability === 'available'
            ? 'Disponível'
            : 'Em atendimento'}
        </small>

        <div className="map-info-card__meta">
          <span>
            Área: {item.areaId}
          </span>

          <span>
            Distância: {item.distanceKm} km
          </span>

          <span>
            Nota: {item.rating}
          </span>

          <span>
            {item.workload} atendimento(s)
            em andamento
          </span>
        </div>

        <em>
          {topSpecialty
            ? `Especialista em ${categoryLabel(
                topSpecialty
              )}`
            : 'Sem especialidade cadastrada'}
        </em>
      </div>
    )
  }

  /*
   * ============================================================
   * EQUIPAMENTO
   * ============================================================
   */
  const recurrence = incidents.filter(
    (incident) =>
      incident.equipmentId === item.id
  ).length

  return (
    <div
      ref={cardRef}
      className={cardClassName}
      style={style}
      onClick={(event) =>
        event.stopPropagation()
      }
    >
      <button
        type="button"
        className="map-info-card__close"
        onClick={onClose}
        aria-label="Fechar informações"
      >
        ×
      </button>

      <strong>{item.id}</strong>

      <small>
        {building?.name ||
          'Local não informado'}
      </small>

      <div className="map-info-card__meta">
        <span>{item.code}</span>

        <span>{item.model}</span>

        <span>
          Status: {equipmentStatusLabel(item.status)}
        </span>

        <span>
          Criticidade:{' '}
          {priorityLabel(item.criticality)}
        </span>

        <span>
          {recurrence} ocorrência(s)
        </span>
      </div>
    </div>
  )
}


export default OperationsMap
