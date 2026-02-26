// Datos mockup para el dashboard con actualización aleatoria

export interface DashboardResumenMock {
  incidentes_hoy: number;
  alarmas_criticas: number;
  flota_activa: number;
  trabajadores_turno: number;
}

export interface IncidentesPorDiaMock {
  fecha: string;
  incidentes: number;
}

export interface AlarmasPorSeveridadMock {
  severidad: string;
  cantidad: number;
}

export interface IncidentesPorClasificacionMock {
  clasificacion: string;
  cantidad: number;
}

export interface AlarmaDisparadaMock {
  id_evento: number;
  id_mina: number;
  tipo_evento: string;
  severidad: number;
  descripcion: string;
  estado: string;
  creado_en: string;
  minas?: { nombre: string; codigo: string };
}

export interface MinaMock {
  id_mina: number;
  nombre: string;
  codigo: string;
  ubicacion: string;
  empresa: string;
}

// Función para generar números aleatorios en un rango
const randomBetween = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

// Función para generar variación porcentual
const randomVariation = (base: number, variance: number = 0.3) => 
  Math.floor(base * (1 + (Math.random() - 0.5) * variance));

// Generar resumen del dashboard
export function generarDashboardResumen(): DashboardResumenMock {
  return {
    incidentes_hoy: randomBetween(0, 8),
    alarmas_criticas: randomBetween(0, 3),
    flota_activa: randomBetween(15, 45),
    trabajadores_turno: randomBetween(120, 280),
  };
}

// Generar incidentes de los últimos 7 días
export function generarIncidentesUltimos7Dias(): IncidentesPorDiaMock[] {
  const diasSemana = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
  const resultado: IncidentesPorDiaMock[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);
    const dia = diasSemana[fecha.getDay()];
    
    // Generar entre 0-5 incidentes por día
    resultado.push({
      fecha: dia,
      incidentes: randomBetween(0, 5),
    });
  }
  
  return resultado;
}

// Generar alarmas por severidad
export function generarAlarmasPorSeveridad(): AlarmasPorSeveridadMock[] {
  return [
    { severidad: "1 - Muy Baja", cantidad: randomBetween(5, 15) },
    { severidad: "2 - Baja", cantidad: randomBetween(8, 20) },
    { severidad: "3 - Media", cantidad: randomBetween(3, 12) },
    { severidad: "4 - Alta", cantidad: randomBetween(1, 6) },
    { severidad: "5 - Crítica", cantidad: randomBetween(0, 3) },
  ];
}

// Generar incidentes por clasificación
export function generarIncidentesPorClasificacion(): IncidentesPorClasificacionMock[] {
  return [
    { clasificacion: "Leve", cantidad: randomBetween(8, 20) },
    { clasificacion: "Moderado", cantidad: randomBetween(3, 10) },
    { clasificacion: "Grave", cantidad: randomBetween(1, 4) },
    { clasificacion: "Crítico", cantidad: randomBetween(0, 2) },
  ];
}

// Generar alarmas activas
export function generarAlarmasActivas(): AlarmaDisparadaMock[] {
  const tiposEvento = [
    "Temperatura Alta",
    "Presión Baja", 
    "Vibración Excesiva",
    "Nivel de Gas",
    "Fallo de Comunicación",
    "Batería Baja",
    "Movimiento Detectado",
    "Puerta Abierta"
  ];
  
  const estados = ["activo", "revisado", "falso_positivo"];
  const minas = [
    { id_mina: 1, nombre: "Mina El Bronce", codigo: "MEB001" },
    { id_mina: 2, nombre: "Mina San José", codigo: "MSJ002" },
    { id_mina: 3, nombre: "Mina La Escondida", codigo: "MLE003" }
  ];
  
  const alarmas: AlarmaDisparadaMock[] = [];
  const numAlarmas = randomBetween(5, 15);
  
  for (let i = 0; i < numAlarmas; i++) {
    const mina = minas[randomBetween(0, minas.length - 1)];
    const fecha = new Date();
    fecha.setMinutes(fecha.getMinutes() - randomBetween(5, 180));
    
    alarmas.push({
      id_evento: 1000 + i,
      id_mina: mina.id_mina,
      tipo_evento: tiposEvento[randomBetween(0, tiposEvento.length - 1)],
      severidad: randomBetween(1, 5),
      descripcion: `Detección anormal en sensor ${randomBetween(100, 999)}`,
      estado: estados[randomBetween(0, estados.length - 1)],
      creado_en: fecha.toISOString(),
      minas: mina,
    });
  }
  
  return alarmas.sort((a, b) => 
    new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime()
  );
}

// Generar últimas alarmas (más recientes)
export function generarUltimasAlarmas(): AlarmaDisparadaMock[] {
  return generarAlarmasActivas().slice(0, 8);
}

// Generar datos de minas para gráficos
export function generarDatosMinas(): MinaMock[] {
  return [
    {
      id_mina: 1,
      nombre: "Mina El Bronce",
      codigo: "MEB001",
      ubicacion: "Antofagasta, Chile",
      empresa: "Minera del Norte S.A."
    },
    {
      id_mina: 2,
      nombre: "Mina San José", 
      codigo: "MSJ002",
      ubicacion: "Copiapó, Chile",
      empresa: "Cobre Andino Ltda."
    },
    {
      id_mina: 3,
      nombre: "Mina La Escondida",
      codigo: "MLE003", 
      ubicacion: "Calama, Chile",
      empresa: "BHP Chile S.A."
    }
  ];
}

// Generar estadísticas por mina
export function generarEstadisticasPorMina() {
  const minas = generarDatosMinas();
  
  return minas.map(mina => ({
    id_mina: mina.id_mina,
    nombre: mina.nombre,
    codigo: mina.codigo,
    incidentes_hoy: randomBetween(0, 3),
    alarmas_activas: randomBetween(2, 8),
    flota_operando: randomBetween(5, 15),
    trabajadores_presentes: randomBetween(40, 90),
    produccion_diaria: randomBetween(850, 1200), // toneladas
    disponibilidad_equipo: randomBetween(85, 98), // porcentaje
    indice_seguridad: randomBetween(0.8, 1.0), // 0-1
  }));
}

// Función principal para generar todos los datos mockup
export function generarTodosLosDatosMock() {
  return {
    resumen: generarDashboardResumen(),
    incidentes_7_dias: generarIncidentesUltimos7Dias(),
    alarmas_severidad: generarAlarmasPorSeveridad(),
    incidentes_clasificacion: generarIncidentesPorClasificacion(),
    alarmas_activas: generarAlarmasActivas(),
    ultimas_alarmas: generarUltimasAlarmas(),
    minas: generarDatosMinas(),
    estadisticas_minas: generarEstadisticasPorMina(),
  };
}
