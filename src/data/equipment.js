export const equipment = [
  {
    id: 'EQP-2841',
    buildingId: 'BLD-001',
    code: 'ELV-A',
    category: 'elevator',
    manufacturer: 'Otis',
    model: 'Gen2 Comfort',
    type: 'Passageiros',
    status: 'out_of_service',
    floors: 18,
    lastMaintenance: '2026-08-07',
    criticality: 'high',
  },
  {
    id: 'EQP-1932',
    buildingId: 'BLD-002',
    code: 'ELV-03',
    category: 'elevator',
    manufacturer: 'Otis',
    model: 'SkyRise',
    type: 'Passageiros',
    status: 'operational',
    floors: 4,
    lastMaintenance: '2026-08-12',
    criticality: 'medium',
  },
  {
    id: 'EQP-4510',
    buildingId: 'BLD-003',
    code: 'ELV-H2',
    category: 'elevator',
    manufacturer: 'Otis',
    model: 'Gen2 Premier',
    type: 'Maca',
    status: 'operational',
    floors: 12,
    lastMaintenance: '2026-08-20',
    criticality: 'critical',
  },
  {
    id: 'EQP-5104',
    buildingId: 'BLD-004',
    code: 'ELV-B',
    category: 'elevator',
    manufacturer: 'Otis',
    model: 'Gen2 Switch',
    type: 'Passageiros',
    status: 'maintenance',
    floors: 20,
    lastMaintenance: '2026-08-16',
    criticality: 'high',
  },
  {
    id: 'EQP-7201',
    buildingId: 'BLD-002',
    code: 'ESC-01',
    category: 'escalator',
    manufacturer: 'Otis',
    model: 'XO 508',
    type: 'Escada rolante',
    status: 'operational',
    floors: 2,
    lastMaintenance: '2026-08-10',
    criticality: 'medium',
  },
  {
    id: 'EQP-7202',
    buildingId: 'BLD-009',
    code: 'ESC-02',
    category: 'escalator',
    manufacturer: 'Otis',
    model: 'XO 508',
    type: 'Escada rolante',
    status: 'operational',
    floors: 3,
    lastMaintenance: '2026-08-05',
    criticality: 'medium',
  },
  {
    id: 'EQP-7203',
    buildingId: 'BLD-009',
    code: 'ESA-01',
    category: 'escalator',
    manufacturer: 'Otis',
    model: 'Compact Walk',
    type: 'Esteira rolante',
    status: 'maintenance',
    floors: 1,
    lastMaintenance: '2026-08-18',
    criticality: 'high',
  },
  {
    id: 'EQP-7204',
    buildingId: 'BLD-007',
    code: 'ESC-03',
    category: 'escalator',
    manufacturer: 'Otis',
    model: 'XO 508',
    type: 'Escada rolante',
    status: 'operational',
    floors: 2,
    lastMaintenance: '2026-08-14',
    criticality: 'low',
  },

  ...[
    'BLD-005',
    'BLD-006',
    'BLD-007',
    'BLD-008',
    'BLD-009',
    'BLD-010',
    'BLD-001',
    'BLD-002',
    'BLD-003',
    'BLD-004',
    'BLD-005',
  ].map((buildingId, index) => {
    const isEscalator = index === 2 || index === 5 || index === 8

    return {
      id: `EQP-${6101 + index}`,
      buildingId,
      code: isEscalator
        ? `ESC-${index + 4}`
        : `ELV-${index + 1}`,
      category: isEscalator
        ? 'escalator'
        : 'elevator',
      manufacturer: 'Otis',
      model: isEscalator
        ? index === 5
          ? 'Compact Walk'
          : 'XO 508'
        : index % 2
          ? 'Gen2 Premier'
          : 'Gen2 Comfort',
      type: isEscalator
        ? index === 5
          ? 'Esteira rolante'
          : 'Escada rolante'
        : index % 3 === 0
          ? 'Maca'
          : 'Passageiros',
      status:
        index % 5 === 0
          ? 'maintenance'
          : 'operational',
      floors: isEscalator
        ? index === 5
          ? 1
          : 2
        : 8 + index,
      lastMaintenance: `2026-08-${String(
        8 + index
      ).padStart(2, '0')}`,
      criticality:
        index % 4 === 0
          ? 'high'
          : 'medium',
    }
  }),
]
