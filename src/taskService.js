/*
 * TODO REFACTOR LAB · LÓGICA DE DOMINIO
 *
 * Completa estas funciones misión por misión. Favorece funciones que reciben
 * datos y devuelven datos, sin acceder al DOM. Ejecuta la suite después de
 * cada cambio.
 */

// MISIÓN 2
export function crearTarea(id, titulo) {
  return { id, titulo, completada: false };
}

// MISIÓN 3
export function agregarTarea(tareas, nuevaTarea) {
  return [...tareas, nuevaTarea];
}

// MISIÓN 4
export function buscarTarea(tareas, id) {
  return tareas.find((tarea) => tarea.id === id);
}

// MISIÓN 5
export function obtenerPendientes(tareas) {
  return tareas.filter((tarea) => !tarea.completada);
}

export function obtenerTerminadas(tareas) {
  return tareas.filter((tarea) => tarea.completada);
}

// MISIÓN 6
export function cambiarEstado(tareas, id) {
  return tareas.map((tarea) =>
    tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
  );
}

// MISIÓN 7
export function eliminarTarea(tareas, id) {
  return tareas.filter((tarea) => tarea.id !== id);
}

// MISIÓN 8
export function obtenerResumen(tareas) {
  // TODO: devolver { total, pendientes, terminadas }.
  throw new Error("Misión 8 pendiente: implementar obtenerResumen()");
}