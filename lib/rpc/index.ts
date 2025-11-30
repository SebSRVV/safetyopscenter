export * from "./minas";
export * from "./flota";
export {
  type Dispositivo,
  listarDispositivos,
  obtenerDispositivo,
  crearDispositivo,
  actualizarDispositivo,
  eliminarDispositivo,
  asignarDispositivoLugar,
  obtenerUltimaLectura,
  asignarDispositivoUnidad as asignarDispositivoAUnidad,
} from "./dispositivos";
export * from "./alarmas";
export * from "./incidentes";
export * from "./semaforos";
export * from "./metrics";
