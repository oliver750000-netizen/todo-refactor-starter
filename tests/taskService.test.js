import { describe, it, expect } from "vitest";
import {
  crearTarea,
  agregarTarea,
  buscarTarea,
  obtenerPendientes,
  obtenerTerminadas,
  cambiarEstado,
  eliminarTarea,
  obtenerResumen,
  esTituloValido,
  filtrarPorEstado,
  siguienteId,
  buscarPorTexto
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

describe("cambiarEstado", () => {
  it("invierte completada de la tarea indicada", () => {
    // Arrange
    const tareas = mixtas();

    // Act
    const resultado = cambiarEstado(tareas, 1);

    // Assert
    expect(buscarTarea(resultado, 1).completada).toBe(true);
  });

  it("no altera las demás tareas", () => {
    const resultado = cambiarEstado(mixtas(), 1);

    expect(buscarTarea(resultado, 2)).toEqual({ id: 2, titulo: "Diseñar pruebas", completada: true });
    expect(buscarTarea(resultado, 3)).toEqual({ id: 3, titulo: "Refactorizar código", completada: false });
  });

  it("con id inexistente conserva el contenido", () => {
    expect(cambiarEstado(mixtas(), 99)).toEqual(mixtas());
  });

  it("no muta el objeto original", () => {
    const tareas = mixtas();

    cambiarEstado(tareas, 1);

    expect(tareas[0].completada).toBe(false);
  });
});

describe("eliminarTarea", () => {
  it("elimina la tarea con id existente", () => {
    // Arrange
    const tareas = mixtas();

    // Act
    const resultado = eliminarTarea(tareas, 2);

    // Assert
    expect(resultado.map((t) => t.id)).toEqual([1, 3]);
  });

  it("con id inexistente deja la colección igual", () => {
    expect(eliminarTarea(mixtas(), 99)).toEqual(mixtas());
  });

  it("con colección vacía devuelve []", () => {
    expect(eliminarTarea([], 1)).toEqual([]);
  });

  it("no modifica el array original", () => {
    const tareas = mixtas();

    eliminarTarea(tareas, 1);

    expect(tareas).toHaveLength(3);
  });
});

describe("obtenerResumen", () => {
  it("cuenta total, pendientes y terminadas", () => {
    // Arrange
    const tareas = mixtas();

    // Act
    const resumen = obtenerResumen(tareas);

    // Assert
    expect(resumen).toEqual({ total: 3, pendientes: 2, terminadas: 1 });
  });

  it("devuelve ceros con colección vacía", () => {
    expect(obtenerResumen([])).toEqual({ total: 0, pendientes: 0, terminadas: 0 });
  });

  it("pendientes + terminadas siempre suman el total", () => {
    const resumen = obtenerResumen(mixtas());

    expect(resumen.pendientes + resumen.terminadas).toBe(resumen.total);
  });
});   

describe("esTituloValido", () => {
  it("acepta un título con texto", () => {
    expect(esTituloValido("Estudiar")).toBe(true);
  });

  it("rechaza vacío y solo espacios", () => {
    expect(esTituloValido("")).toBe(false);
    expect(esTituloValido("   ")).toBe(false);
  });
});

describe("filtrarPorEstado", () => {
  it("'todas' devuelve todo", () => {
    expect(filtrarPorEstado(mixtas(), "todas")).toHaveLength(3);
  });

  it("'pendientes' devuelve solo las pendientes", () => {
    expect(filtrarPorEstado(mixtas(), "pendientes").map((t) => t.id)).toEqual([1, 3]);
  });

  it("'terminadas' devuelve solo las terminadas", () => {
    expect(filtrarPorEstado(mixtas(), "terminadas").map((t) => t.id)).toEqual([2]);
  });
});

describe("siguienteId", () => {
  it("devuelve 1 si no hay tareas", () => {
    expect(siguienteId([])).toBe(1);
  });

  it("no reutiliza ids tras eliminar", () => {
    const tareas = eliminarTarea(mixtas(), 2); 
    expect(siguienteId(tareas)).toBe(4);
  });
});

describe("buscarPorTexto", () => {
  it("encuentra coincidencias parciales", () => {
    const tareas = mixtas();
    const resultado = buscarPorTexto(tareas, "prueb");
    expect(resultado.map((t) => t.id)).toEqual([2]);
  });

  it("ignora mayúsculas y minúsculas", () => {
    expect(buscarPorTexto(mixtas(), "REFACTOR").map((t) => t.id)).toEqual([3]);
  });

  it("ignora espacios al inicio y al final de la búsqueda", () => {
    expect(buscarPorTexto(mixtas(), "  requisitos  ").map((t) => t.id)).toEqual([1]);
  });

  it("texto vacío devuelve todas las tareas", () => {
    expect(buscarPorTexto(mixtas(), "")).toHaveLength(3);
  });

  it("sin coincidencias devuelve []", () => {
    expect(buscarPorTexto(mixtas(), "zzz")).toEqual([]);
  });

  it("colección vacía devuelve []", () => {
    expect(buscarPorTexto([], "a")).toEqual([]);
  });
});