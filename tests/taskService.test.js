import { describe, it, expect } from "vitest";
import {
  crearTarea,
  agregarTarea,
  buscarTarea,
  obtenerPendientes,
  obtenerTerminadas,
  cambiarEstado,
  eliminarTarea,
  obtenerResumen
} from "../src/taskService.js";




const mixtas = () => [
  {id: 1, titulo: "Revisar requisitos", completada: false},
  {id: 2, titulo: "Diseñar pruebas", completada: true},
  {id: 3, titulo: "Refactorizar código", completada: false}
]

/*
 * TODO REFACTOR LAB · SUITE STARTER
 
 * Activa/crea pruebas misión por misión. No escribas todas las soluciones de
 * una vez. Para cada comportamiento sigue RED → GREEN → REFACTOR.
 */

describe("crearTarea", () => {
  it("crea una tarea pendiente con id y título", () => {
    // Arrange
    const id = 10;
    const titulo = "Diseñar pruebas";

    // Act
    const tarea = crearTarea(id, titulo);

    // Assert
    expect(tarea).toEqual({ id: 10, titulo: "Diseñar pruebas", completada: false });
  });
});

describe("agregarTarea", () => {
  it("devuelve la colección con la nueva tarea al final", () => {
    // Arrange
    const tareas = [crearTarea(1, "A")];
    const nueva = crearTarea(2, "B");

    // Act
    const resultado = agregarTarea(tareas, nueva);

    // Assert
    expect(resultado).toEqual([
      { id: 1, titulo: "A", completada: false },
      { id: 2, titulo: "B", completada: false }
    ]);
  });

  it("el resultado tiene un elemento más", () => {
    const tareas = mixtas();

    const resultado = agregarTarea(tareas, crearTarea(4, "Nueva"));

    expect(resultado).toHaveLength(tareas.length + 1);
  });

  it("no modifica el array recibido", () => {
    const tareas = mixtas();

    agregarTarea(tareas, crearTarea(4, "Nueva"));

    expect(tareas).toHaveLength(3);
  });
});

describe("buscarTarea", () => {
  it("encuentra una tarea con id existente", () => {
    // Arrange
    const tareas = mixtas();

    // Act
    const tarea = buscarTarea(tareas, 2);

    // Assert
    expect(tarea).toEqual({ id: 2, titulo: "Diseñar pruebas", completada: true });
  });

  it("devuelve undefined si el id no existe", () => {
    const tareas = mixtas();

    const tarea = buscarTarea(tareas, 99);

    expect(tarea).toBeUndefined();
  });

  it("devuelve undefined en una colección vacía", () => {
    expect(buscarTarea([], 1)).toBeUndefined();
  });
});

describe("obtenerPendientes / obtenerTerminadas", () => {
  it("separa correctamente una colección mixta", () => {
    // Arrange
    const tareas = mixtas();

    // Act
    const pendientes = obtenerPendientes(tareas);
    const terminadas = obtenerTerminadas(tareas);

    // Assert
    expect(pendientes.map((t) => t.id)).toEqual([1, 3]);
    expect(terminadas.map((t) => t.id)).toEqual([2]);
  });

  it("devuelve [] cuando ninguna cumple la condición", () => {
    const todasTerminadas = mixtas().map((t) => ({ ...t, completada: true }));
    const todasPendientes = mixtas().map((t) => ({ ...t, completada: false }));

    expect(obtenerPendientes(todasTerminadas)).toEqual([]);
    expect(obtenerTerminadas(todasPendientes)).toEqual([]);
  });

  it("devuelve [] con colección vacía", () => {
    expect(obtenerPendientes([])).toEqual([]);
    expect(obtenerTerminadas([])).toEqual([]);
  });
});

// MISIÓN 6: prueba cambio correcto, otra tarea intacta e id inexistente.
// MISIÓN 7: prueba eliminar existente, inexistente y colección vacía.
// MISIÓN 8: prueba obtenerResumen(), incluyendo colección vacía.

// Los imports anteriores quedan preparados para que construyas la suite de forma incremental.
void cambiarEstado;
void eliminarTarea;
void obtenerResumen;